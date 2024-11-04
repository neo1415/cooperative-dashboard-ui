"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../app/api/config";

interface AuthContextType {
  role: string | null;
  kycCompleted: boolean;
  cooperativeId: string | null;
  memberId: string | null;
  getCurrentUserToken: () => Promise<string | null>;  // Add this method
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getCurrentUserToken = async () => {
    const user = auth.currentUser;
    return user ? await user.getIdToken() : null;
  };

  const [authData, setAuthData] = useState<AuthContextType>({
    role: null,
    kycCompleted: false,
    cooperativeId: null,
    memberId: null,
    getCurrentUserToken,  // Add the function here
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const idTokenResult = await user.getIdTokenResult();
          const { role, kycCompleted } = idTokenResult.claims;

          setAuthData({
            role: typeof role === 'string' ? role : null,
            kycCompleted: typeof kycCompleted === 'boolean' ? kycCompleted : false,
            cooperativeId: role === 'cooperative-admin' ? user.uid : null,
            memberId: role === 'member' ? user.uid : null,
            getCurrentUserToken,  // Ensure the function is included here
          });
        } else {
          setAuthData({
            role: null,
            kycCompleted: false,
            cooperativeId: null,
            memberId: null,
            getCurrentUserToken,
          });
        }
      } catch (error) {
        console.error("Error fetching authentication data:", error);
        setAuthData({
          role: null,
          kycCompleted: false,
          cooperativeId: null,
          memberId: null,
          getCurrentUserToken,
        });
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchAuthData();
      } else {
        setAuthData({
          role: null,
          kycCompleted: false,
          cooperativeId: null,
          memberId: null,
          getCurrentUserToken,
        });
        setLoading(false);
      }
    });

    // Clean up on component unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={authData}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
