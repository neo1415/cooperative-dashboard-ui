"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  role: string | null;
  kycCompleted: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<string | null>(null);
  const [kycCompleted, setKycCompleted] = useState(false);

  useEffect(() => {
    const cachedRole = localStorage.getItem("userRole");
    const cachedKycCompleted = localStorage.getItem("kycCompleted") === "true";

    setRole(cachedRole);
    setKycCompleted(cachedKycCompleted);
  }, []);

  return (
    <AuthContext.Provider value={{ role, kycCompleted }}>
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

// "use client"
// import React, { createContext, useContext, useEffect, useState } from "react";
// import { auth } from "@/app/api/config";
// import { useRouter, usePathname } from "next/navigation";
// import { onAuthStateChanged, setPersistence, browserLocalPersistence } from "firebase/auth";

// interface AuthContextType {
//   isAuthenticated: boolean;
//   role: string | null;
//   kycCompleted: boolean;
//   loading: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [role, setRole] = useState<string | null>(null);
//   const [kycCompleted, setKycCompleted] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
//   const pathname = usePathname();

//   useEffect(() => {
//     const cachedToken = localStorage.getItem("firebaseToken");
//     const cachedRole = localStorage.getItem("userRole");
//     const cachedKycCompleted = localStorage.getItem("kycCompleted") === "true";

//     if (cachedToken && cachedRole) {
//       setIsAuthenticated(true);
//       setRole(cachedRole);
//       setKycCompleted(cachedKycCompleted);
//       setLoading(false);
//     } else {
//       setLoading(true);
//     }

//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       setLoading(true);
//       if (user) {
//         try {
//           const idTokenResult = await user.getIdTokenResult();
//           const userRole = idTokenResult.claims.role as string;

//           const idToken = await user.getIdToken();
//           localStorage.setItem("firebaseToken", idToken);
//           localStorage.setItem("userRole", userRole);
//           localStorage.setItem("kycCompleted", idTokenResult.claims.kycCompleted ? "true" : "false");

//           setIsAuthenticated(true);
//           setRole(userRole);
//           setKycCompleted(!!idTokenResult.claims.kycCompleted);

//           // Role-based redirection, only if the user is not already on the page
//           if (userRole === "cooperative-admin" || userRole === "admin") {
//             if (idTokenResult.claims.kycIncomplete && pathname !== "/cooperativeForm") {
//               router.push("/cooperativeForm");
//             } else if (!idTokenResult.claims.kycIncomplete && pathname !== "/cooperative-admin") {
//               router.push("/cooperative-admin");
//             }
//           } else if (userRole === "member" && pathname !== "/member") {
//             router.push("/member");
//           }

//         } catch (error) {
//           console.error("Error checking user token:", error);
//           setIsAuthenticated(false);
//         } finally {
//           setLoading(false);
//         }
//       } else {
//         localStorage.clear(); // Clear all related auth data
//         setIsAuthenticated(false);
//         setRole(null);
//         setKycCompleted(false);
//         setLoading(false);
//       }
//     });

//     return () => unsubscribe();
//   }, [router, pathname]);

//   // Set Firebase auth persistence
//   useEffect(() => {
//     setPersistence(auth, browserLocalPersistence)
//       .then(() => console.log("Firebase auth persistence set to 'local'"))
//       .catch((error) => console.error("Error setting auth persistence:", error));
//   }, []);

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, role, kycCompleted, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };