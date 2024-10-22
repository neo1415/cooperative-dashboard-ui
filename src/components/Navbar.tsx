"use client"

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/app/api/config';

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Listen for changes to the authenticated user
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      console.log("Auth state changed. Current user:", currentUser);
      setUser(currentUser);
    });
  
    return () => unsubscribe(); // Cleanup the listener
  }, []);
  

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login'); // Redirect to login page after sign out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Get user's initials from displayName if no profile picture
  const getInitials = (name: string) => {
    const initials = name.split(' ').map((n) => n[0]).join('');
    return initials.toUpperCase();
  };

  return (
    <div className="flex items-center justify-between p-4">
      {/* SEARCH BAR */}
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Image
          src="/search.png"
          alt="search-icon"
          width={14}
          height={14}
        />
        <input
          type="text"
          placeholder="Search..."
          className="w-[200px] p-2 bg-transparent outline-none"
        />
      </div>

      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full">
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <Image
            src="/message.png"
            alt="message-icon"
            width={20}
            height={20}
          />
        </div>
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Image
            src="/announcement.png"
            alt="announcement-icon"
            width={20}
            height={20}
          />
          <div className="absolute -top-3 -right-3 w-7 h-7 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">1</div>
        </div>

        {/* USER PROFILE */}
        <div className="relative">
          <div
            className="bg-white rounded-full w-9 h-9 flex items-center justify-center cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {user && user.photoURL ? (
              <Image
                src={user.photoURL}
                alt="User Profile"
                className="w-9 h-9 rounded-full"
              />
            ) : user && user.displayName ? (
              <span className="text-sm font-medium">
                {getInitials(user.displayName)}
              </span>
            ) : (
              <span className="text-sm font-medium">N/A</span>
            )}
          </div>

          {/* DROPDOWN MENU */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-2">
              <button
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
