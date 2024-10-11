const serverURL: string = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';

export const endpoints = {
  getUsers: `${serverURL}/get-users`,
  logIn: `${serverURL}/login`,
  assignAdminRole: (userId: string | number): string => `${serverURL}/assign-admin-role/${userId}`,
  assignModeratorRole: (userId: string | number): string => `${serverURL}/assign-moderator-role/${userId}`,
  assignDefaultRole: (userId: string | number): string => `${serverURL}/assign-default-role/${userId}`,
  checkAdminClaim: `${serverURL}/check-admin-claim`,
  checkUserRole: (userId: string | number): string => `${serverURL}/check-user-role/${userId}`,
  updateUserRole: (userId: string | number): string => `${serverURL}/update-user-role/${userId}`,
};
