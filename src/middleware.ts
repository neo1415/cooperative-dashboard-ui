import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define a type for protected routes
type ProtectedRoutes = {
  [key: string]: string[];
};

// Define all protected routes and their respective roles
const protectedRoutes: ProtectedRoutes = {
  '/': ['super-admin', 'admin', 'member', 'auditor', 'cooperative-admin', 'cooperative-auditor'],
  '/list/cooperatives': ['admin', 'super-admin', 'auditor'],
  '/list/users': ['admin', 'super-admin', 'auditor', 'cooperative-admin'],
  '/loanForm': ['admin', 'super-admin', 'auditor', 'member'],
  '/list/loansRequested': ['admin', 'super-admin', 'auditor', 'cooperative-admin', 'member'],
  '/list/loansApproved': ['admin', 'super-admin', 'auditor', 'cooperative-admin'],
  '/list/assetsRequested': ['admin', 'super-admin', 'auditor', 'cooperative-admin'],
  '/list/assetsTransfered': ['admin', 'super-admin', 'auditor', 'cooperative-admin'],
  '/list/debtors': ['admin', 'super-admin', 'cooperative-admin'],
  '/list/marketPlace': ['admin', 'member', 'cooperative-admin'],
  '/list/productListing': ['member'],
  '/list/productPurchased': ['member'],
  '/list/allAssetsPage': ['super-admin', 'admin', 'member'],
  '/list/allLoansPage': ['super-admin', 'admin', 'member'],
  '/list/allProductsPage': ['super-admin', 'admin', 'member'],
  '/list/generalReports': ['admin', 'super-admin', 'auditor'],
  '/list/analytics': ['admin', 'super-admin', 'member', 'auditor'],
  '/list/messages': ['admin', 'super-admin', 'member', 'auditor'],
  '/list/announcements': ['admin', 'teacher', 'student', 'parent'],
  '/profile': ['admin', 'super-admin', 'member', 'auditor'],
  '/settings': ['admin', 'super-admin', 'member', 'auditor'],
  '/logout': ['admin', 'super-admin', 'member', 'auditor'],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Get the token from cookies (assuming the token is stored in cookies after login)
  const token = req.cookies.get('firebaseToken')?.value;
  
  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    // Decode the Firebase token locally (without verification)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const decodedToken = JSON.parse(jsonPayload);
    const userRole = decodedToken.role; // Assume custom claims have a `role`
    const kycCompleted = decodedToken.kycCompleted; // Assume custom claims have `kycCompleted`

    // Check if the route is protected and if the user has access
    const rolesAllowed = protectedRoutes[pathname as keyof ProtectedRoutes]; // Use the type to access the roles
    if (!rolesAllowed || !rolesAllowed.includes(userRole)) {
      // If user role doesn't match the required roles, redirect to an error page
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    // For specific routes, check if KYC is completed
    if (pathname === '/loanForm' && !kycCompleted) {
      // Redirect to KYC form if KYC is not completed
      return NextResponse.redirect(new URL('/member-form', req.url));
    }

    // If the user is authenticated and has the required role, continue to the page
    return NextResponse.next();
  } catch (error) {
    console.error('Error decoding token:', error);
    // Redirect to login on token decoding failure
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// Apply middleware to all protected routes
export const config = {
  matcher: [
    '/', '/list/cooperatives', '/list/users', '/loanForm', '/list/loansRequested',
    '/list/loansApproved', '/list/assetsRequested', '/list/assetsTransfered',
    '/list/debtors', '/list/marketPlace', '/list/productListing', '/list/productPurchased',
    '/list/allAssetsPage', '/list/allLoansPage', '/list/allProductsPage',
    '/list/generalReports', '/list/analytics', '/list/messages', '/list/announcements',
    '/profile', '/settings', '/logout'
  ],
};
