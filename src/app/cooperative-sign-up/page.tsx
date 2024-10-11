"use client"

import { useRouter } from 'next/navigation';
// import { csrfProtectedPost } from '@/lib/csurf';
// import axios from 'axios';
import { useState } from 'react';


const CooperativeSignUp = () => {
  const [email, setEmail] = useState<string>('');
  const [cooperativeName, setCooperativeName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successModalOpen, setSuccessModalOpen] = useState<boolean>(false);

  const router = useRouter();

  const submitRegistration = async () => {
    const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';
    const registrationEndpoint = `${serverURL}/register`;
  
    try {
      setIsLoading(true);
  
      // Use fetch instead of Axios for testing
      const response = await fetch(registrationEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          cooperativeName,
          password,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
          router.push('/');
  
        // Store the cooperativeId in localStorage
        localStorage.setItem('cooperativeId', data.cooperativeId);
  
        // Open success modal
        openSuccessModal();
      } else {
        const errorData = await response.json();
        console.error('Server response error:', errorData);
        setError('An unexpected error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setError('An error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  
  const openSuccessModal = () => {
    setSuccessModalOpen(true);
    setTimeout(() => {
      setSuccessModalOpen(false);
    }, 3000);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-lamaSkyLight">
      <div className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2">
        <h1 className="text-xl font-bold">User Registration</h1>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Email Address</label>
          <input
            type="email"
            required
            className="p-2 rounded-md ring-1 ring-gray-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Name</label>
          <input
            type="text"
            required
            className="p-2 rounded-md ring-1 ring-gray-300"
            value={cooperativeName}
            onChange={(e) => setCooperativeName(e.target.value)}
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

        {error && (
          <p className="text-xs text-red-400 text-center">{error}</p>
        )}

        <button
          onClick={submitRegistration}
          disabled={isLoading}
          className="bg-blue-500 text-white my-1 rounded-md text-sm p-[10px]"
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>

        {/* Success Modal */}
        {successModalOpen && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-md shadow-lg">
            <h2 className="font-bold">Registration Successful</h2>
            <p>Your account has been created successfully. ✅</p>
            <button
              className="mt-2 text-blue-500 underline"
              onClick={() => setSuccessModalOpen(false)}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CooperativeSignUp;
