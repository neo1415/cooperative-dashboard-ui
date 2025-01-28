"use client";
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { auth } from "../app/api/config";

interface AuthContextType {
  role: string | null;
  kycCompleted: boolean;
  cooperativeId: string | null;
  memberId: string | null;
  getCurrentUserToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Memoized function to reduce redundant token fetches
  const getCurrentUserToken = useCallback(async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        return await user.getIdToken();
      } catch (error) {
        console.error("Error fetching ID token:", error);
        return null;
      }
    }
    return null;
  }, []);

  const [role, setRole] = useState<string | null>(null);
  const [kycCompleted, setKycCompleted] = useState(false);
  const [cooperativeId, setCooperativeId] = useState<string | null>(null);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAuthData = useCallback(async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        const { role, kycCompleted } = idTokenResult.claims;

        setRole(typeof role === "string" ? role : null);
        setKycCompleted(typeof kycCompleted === "boolean" ? kycCompleted : false);
        setCooperativeId(role === "cooperative-admin" ? user.uid : null);
        setMemberId(role === "member" ? user.uid : null);
      } else {
        setRole(null);
        setKycCompleted(false);
        setCooperativeId(null);
        setMemberId(null);
      }
    } catch (error) {
      console.error("Error fetching authentication data:", error);
      setRole(null);
      setKycCompleted(false);
      setCooperativeId(null);
      setMemberId(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchAuthData();
      } else {
        setRole(null);
        setKycCompleted(false);
        setCooperativeId(null);
        setMemberId(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [fetchAuthData]);

  const authData = useMemo(
    () => ({ role, kycCompleted, cooperativeId, memberId, getCurrentUserToken }),
    [role, kycCompleted, cooperativeId, memberId, getCurrentUserToken]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="border-top-color:transparent w-8 h-8 border-4 border-blue-200 rounded-full animate-spin"></div>
        <p className="ml-2">Loading...</p>
        <style>{`
          .loading-container {
            animation: fadeIn 0.5s ease-in-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
      </div>
    );
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
