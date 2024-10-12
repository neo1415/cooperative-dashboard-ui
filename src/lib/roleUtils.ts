// utils/roleUtil.ts

import { auth } from "@/app/api/config";


interface CustomClaims {
  role?: string; // Define role as an optional string
  kycCompleted?: boolean; // Define kycCompleted as an optional boolean
}

interface UserRole {
  role: string | null;
  kycCompleted: boolean;
}

export const fetchUserRole = async (): Promise<UserRole> => {
  const user = auth.currentUser;

  if (user) {
    // Get custom claims from Firebase
    const idTokenResult = await user.getIdTokenResult();
    const claims = idTokenResult.claims as CustomClaims; // Assert the claims type

    return {
      role: claims.role || null, // Return the role or null if not set
      kycCompleted: claims.kycCompleted || false, // Default to false if not set
    };
  }

  // Return default values if no user is logged in
  return {
    role: null,
    kycCompleted: false,
  };
};

// Utility function to check if the user's role is allowed to see the menu item
export const canAccessMenu = (role: string | null, visibleRoles: string[]): boolean => {
  console.log("Checking access for role:", role, "Visible for:", visibleRoles);  // Add log
  return role ? visibleRoles.includes(role) : false;
};
