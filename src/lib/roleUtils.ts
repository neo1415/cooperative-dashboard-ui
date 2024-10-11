// utils/roleUtil.ts

import { auth } from "@/app/api/config";


interface CustomClaims {
    role?: string; // Define role as an optional string
    // Add other claims if necessary
  }
  
  export const fetchUserRole = async (): Promise<string | null> => {
    const user = auth.currentUser;
  
    if (user) {
      // Get custom claims from Firebase
      const idTokenResult = await user.getIdTokenResult();
      const claims = idTokenResult.claims as CustomClaims; // Assert the claims type
  
      return claims.role || null; // Return the role or null if not set
    }
  
    return null; // Return null if no user is logged in
  };
// Utility function to check if the user's role is allowed to see the menu item
export const canAccessMenu = (role: string | null, visibleRoles: string[]): boolean => {
  return role ? visibleRoles.includes(role) : false;
};
