"use client"

import { useEffect, useState } from 'react';
import { signInWithEmailAndPassword, getIdTokenResult, sendEmailVerification } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { auth } from '../api/config';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  // Check if user is already logged in and redirect based on role
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const idTokenResult = await user.getIdTokenResult();
          const userRole = idTokenResult.claims.role;
          const kycIncomplete = idTokenResult.claims.kycIncomplete;

          // Redirect based on user role and KYC status
          if (userRole === 'cooperative-admin' || userRole === 'admin') {
            router.push(kycIncomplete ? '/cooperativeForm' : '/cooperative-admin');
          } else if (userRole === 'member') {
            router.push('/member');
          }
        }
      } catch (error) {
        console.error('Error checking user token:', error);
      }
    };

    checkUserStatus();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

  // Check email verification status
  // await user.reload(); // Refresh user data
  // if (!user.emailVerified) {
  //   await sendEmailVerification(user); // Use the imported function here
  //   setShowModal(true);
  //   setTimeout(() => setShowModal(false), 5000); // Hide modal after 5 seconds
  //   throw new Error('Email not verified. Please verify your email.');
  // }

      // Fetch claims and route accordingly
      const idTokenResult = await user.getIdTokenResult();
      const userRole = idTokenResult.claims.role;
      const kycIncomplete = idTokenResult.claims.kycIncomplete;

      if (userRole === 'cooperative-admin' || userRole === 'admin') {
        router.push(kycIncomplete ? '/cooperativeForm' : '/cooperative-admin');
      } else if (userRole === 'member') {
        router.push('/member');
      } else {
        throw new Error('Invalid user role');
      }
    } catch (error: any) {
      console.error('Error during login:', error);
      if (error.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else if (error.code === 'auth/too-many-requests'){
        setError("Too many attempts, please try again later");
      }  else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else {
        setError('Failed to sign in. Please check your credentials.');
      }
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

        <Modal open={showModal} onClose={() => setShowModal(false)}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 1,
            }}
          >
            <h2>Please Verify Your Email</h2>
            <p>An email has been sent to {email}. Please verify your email before logging in.</p>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default LoginPage;
