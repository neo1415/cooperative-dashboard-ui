import { getAuth } from "firebase/auth";

export const fetchUserClaims = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    const idTokenResult = await user.getIdTokenResult(true); // Force refresh
    return idTokenResult.claims; // Return custom claims
  }
  return {};
};
