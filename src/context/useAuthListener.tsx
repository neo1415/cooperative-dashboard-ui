"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/app/api/config";

const useAuthListener = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);
  const [kycCompleted, setKycCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // To handle loading state during auth check
  const router = useRouter();


  useEffect(() => {
    const refreshInterval = setInterval(async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const idToken = await user.getIdToken(true); // Force refresh token
          localStorage.setItem('firebaseToken', idToken);
        } catch (error) {
          console.error('Error refreshing token:', error);
        }
      }
    }, 30 * 60 * 1000); // Refresh every 30 minutes
  
    return () => clearInterval(refreshInterval); // Clear interval on unmount
  }, []);
  
  useEffect(() => {
    // Check if cached values exist in localStorage
    const cachedToken = localStorage.getItem("firebaseToken");
    const cachedRole = localStorage.getItem("userRole");
    const cachedKycCompleted = localStorage.getItem("kycCompleted") === "true";

    // If cached values exist, use them initially to avoid unnecessary delay
    if (cachedToken && cachedRole) {
      setIsAuthenticated(true);
      setRole(cachedRole); // cachedRole is already a string or null
      setKycCompleted(cachedKycCompleted); // cachedKycCompleted is a boolean
      setLoading(false); // Don't show a loading state if we already have cached values
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);

      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult();
          const userRole = idTokenResult.claims.role as string; // Assert as string since it's expected to be a string

          // Cache the token, role, and KYC status in localStorage
          const idToken = await user.getIdToken();
          localStorage.setItem("firebaseToken", idToken);
          localStorage.setItem("userRole", userRole);
          localStorage.setItem(
            "kycCompleted",
            idTokenResult.claims.kycCompleted ? "true" : "false"
          );

          // Set authentication state
          setIsAuthenticated(true);
          setRole(userRole);
          setKycCompleted(!!idTokenResult.claims.kycCompleted);

          // Handle redirects based on the role
          if (userRole === "cooperative-admin" || userRole === "admin") {
            if (idTokenResult.claims.kycIncomplete) {
              router.push("/cooperativeForm");
            } else {
              router.push("/cooperative-admin");
            }
          } else if (userRole === "member") {
            router.push("/member");
          }
        } catch (error) {
          console.error("Error checking user token:", error);
          setIsAuthenticated(false);
        } finally {
          setLoading(false);
        }
      } else {
        // If no user is signed in, clear cached values and reset state
        localStorage.removeItem("firebaseToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("kycCompleted");
        setIsAuthenticated(false);
        setRole(null);
        setKycCompleted(false);
        setLoading(false);
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [ router]);

  return { isAuthenticated, role, kycCompleted, loading };
};

export default useAuthListener;
