'use client';

import { useEffect, useState } from 'react';
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

  // Check if user is already logged in and redirect based on role
  useEffect(() => {
    const checkUserStatus = async () => {
      const firebaseToken = localStorage.getItem('firebaseToken');
      if (firebaseToken) {
        try {
          const auth = getAuth();
          const user = auth.currentUser;
          if (user) {
            const idTokenResult = await user.getIdTokenResult();
            const userRole = idTokenResult.claims.role;

            // Redirect based on user role
            if (userRole === 'cooperative-admin' || userRole === 'admin') {
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
          }
        } catch (error) {
          console.error('Error checking user token:', error);
        }
      }
    };

    checkUserStatus();
  }, [router]); // Run once when component mounts, or when router changes

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      const idToken = await user.getIdToken(true);
      localStorage.setItem('firebaseToken', idToken);
      localStorage.setItem('userId', user.uid);
  
      const idTokenResult = await user.getIdTokenResult(true);
      const userRole = idTokenResult.claims.role;
  
      // Fetch the cooperativeId for the member
      const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';
      const response = await fetch(`${serverURL}/get-member-cooperative/${user.uid}`);
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('cooperativeId', data.cooperativeId); // Store cooperativeId
      } else {
        throw new Error('Error retrieving cooperativeId');
      }
  
      // Redirect based on user role after login
      if (userRole === 'cooperative-admin' || userRole === 'admin') {
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
