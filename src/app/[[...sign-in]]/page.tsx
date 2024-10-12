'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, getAuth, getIdTokenResult } from 'firebase/auth';
import { useRouter } from 'next/navigation';

import Image from 'next/image';
import Link from 'next/link';
import { auth } from '../api/config';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
  
    try {
      // Sign in with Firebase email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Force refresh of token to ensure we get the latest custom claims
      const idToken = await user.getIdToken(true); // Force token refresh
  
      // Store the token in localStorage or sessionStorage to use in API requests
      localStorage.setItem('firebaseToken', idToken);
  
      // Get the custom claims
      const idTokenResult = await user.getIdTokenResult(true);
  
      // Check the user's role
      const userRole = idTokenResult.claims.role;
      if (userRole === 'cooperative-admin' || userRole === 'admin') {
        // If KYC is incomplete, redirect to KYC form
        if (idTokenResult.claims.kycIncomplete) {
          router.push('/cooperativeForm');
        } else {
          router.push('/cooperative-admin');
        }
      } else if (userRole === 'member') {
        router.push('/member');
      } else {
        throw new Error('Invalid user role');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };
  
  

  return (
    <div className="h-screen flex items-center justify-center bg-lamaSkyLight">
      <div className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Image src="/logo.png" alt="ICMS logo" width={24} height={24} />
          ICMS
        </h1>
        <h2 className="text-gray-400">Sign in to your account</h2>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-500">Email</label>
            <input
              type="email"
              required
              className="p-2 rounded-md ring-1 ring-gray-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-500">Password</label>
            <input
              type="password"
              required
              className="p-2 rounded-md ring-1 ring-gray-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white my-1 rounded-md text-sm p-[10px]"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-xs mt-4 text-center">
          Don’t have an account?{' '}
          <Link href="/select-role" className="text-blue-500 underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
