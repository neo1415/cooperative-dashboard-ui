"use client"

import { useSignUp } from '@clerk/nextjs';
import { useEffect } from 'react';
import * as Clerk from '@clerk/elements/common';
import * as SignUp from '@clerk/elements/sign-up';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function SignUpPage() {
  const { signUp, isLoaded } = useSignUp();
  const router = useRouter();

  useEffect(() => {
    // Check if sign up is complete and user is authenticated
    if (isLoaded && signUp?.status === 'complete') {
      const redirectToForm = async () => {
        try {
          // Redirect to cooperative form upon successful verification
          router.push('/cooperativeForm');
        } catch (error) {
          console.error('Error during redirection: ', error);
        }
      };

      redirectToForm();
    }
  }, [isLoaded, signUp, router]);

  return (
    <div className="h-screen flex items-center justify-center bg-lamaSkyLight">
      <SignUp.Root>
        <SignUp.Step
          name="start"
          className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2"
        >
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Image src="/logo.png" alt="" width={24} height={24} />
            ICMS
          </h1>
          <h2 className="text-gray-400">Create an account</h2>
  
          <Clerk.Field name="username" className="flex flex-col gap-2">
            <Clerk.Label className="text-xs text-gray-500">Username</Clerk.Label>
            <Clerk.Input
              type="text"
              required
              className="p-2 rounded-md ring-1 ring-gray-300"
            />
            <Clerk.FieldError className="text-xs text-red-400" />
          </Clerk.Field>
  
          <Clerk.Field name="emailAddress" className="flex flex-col gap-2">
            <Clerk.Label className="text-xs text-gray-500">Email</Clerk.Label>
            <Clerk.Input
              type="email"
              required
              className="p-2 rounded-md ring-1 ring-gray-300"
            />
            <Clerk.FieldError className="text-xs text-red-400" />
          </Clerk.Field>
  
          <Clerk.Field name="password" className="flex flex-col gap-2">
            <Clerk.Label className="text-xs text-gray-500">Password</Clerk.Label>
            <Clerk.Input
              type="password"
              required
              className="p-2 rounded-md ring-1 ring-gray-300"
            />
            <Clerk.FieldError className="text-xs text-red-400" />
          </Clerk.Field>
  
          <SignUp.Action
            submit
            className="bg-blue-500 text-white my-1 rounded-md text-sm p-[10px]"
          >
            Sign up
          </SignUp.Action>
        </SignUp.Step>
  
        <SignUp.Step name="verifications" className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2 mt-4">
          <SignUp.Strategy name="phone_code">
            <h1 className="text-gray-400">Check your phone for an SMS</h1>
  
            <Clerk.Field name="code" className="flex flex-col gap-2">
              <Clerk.Label className="text-xs text-gray-500">Phone Code</Clerk.Label>
              <Clerk.Input
                type="text"
                required
                className="p-2 rounded-md ring-1 ring-gray-300"
              />
              <Clerk.FieldError className="text-xs text-red-400" />
            </Clerk.Field>
  
            <SignUp.Action
              submit
              className="bg-blue-500 text-white my-1 rounded-md text-sm p-[10px]"
            >
              Verify
            </SignUp.Action>
          </SignUp.Strategy>
  
          <SignUp.Strategy name="email_code">
            <h1 className="text-gray-400">Check your email</h1>
  
            <Clerk.Field name="code" className="flex flex-col gap-2">
              <Clerk.Label className="text-xs text-gray-500">Email Code</Clerk.Label>
              <Clerk.Input
                type="text"
                required
                className="p-2 rounded-md ring-1 ring-gray-300"
              />
              <Clerk.FieldError className="text-xs text-red-400" />
            </Clerk.Field>
  
            <SignUp.Action
              submit
              className="bg-blue-500 text-white my-1 rounded-md text-sm p-[10px]"
            >
              Verify
            </SignUp.Action>

          </SignUp.Strategy>
          <p className="text-xs mt-4 text-center">
            Already have an account?{" "}
            <Link href="/" className="text-blue-500 underline">
              Sign in here
            </Link>
          </p>
        </SignUp.Step>
      </SignUp.Root>
    </div>
  );
  
}
