
"use client"

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/",
        visible: ["super-admin", "admin", "member", "auditor", "cooperative-admin", "cooperative-auditor"],
      },
      {
        icon: "/attendance.png",
        label: "Cooperatives",
        href: "/list/cooperatives",
        visible: ["admin", "super-admin", "auditor"],
      },
      {
        icon: "/parent.png",
        label: "Members",
        href: "/list/users",
        visible: ["admin", "super-admin", "auditor","cooperative-admin"],
      },
      {
        icon: "/teacher.png",
        label: "Request Loans",
        href: "/loanForm",
        visible: ["admin", "super-admin","auditor","member"],
      },
      {
        icon: "/teacher.png",
        label: "Loans Requested",
        href: "/list/loansRequested",
        visible: ["admin", "super-admin","auditor","cooperative-admin","member"],
      },
      {
        icon: "/teacher.png",
        label: "Loans Approved",
        href: "/list/loansApproved",
        visible: ["admin", "super-admin","auditor","cooperative-admin"],
      },
      {
        icon: "/student.png",
        label: "Assets Requested",
        href: "/list/assetsRequested",
        visible: ["admin", "super-admin", "auditor","cooperative-admin"],
      },
      {
        icon: "/student.png",
        label: "Assets Transferred",
        href: "/list/assetsTransfered",
        visible: ["admin", "super-admin", "auditor","cooperative-admin"],
      },

      {
        icon: "/subject.png",
        label: "Debtors",
        href: "/list/debtors",
        visible: ["admin", "super-admin","cooperative-admin"],
      },
      {
        icon: "/class.png",
        label: "Market Place",
        href: "/list/marketPlace",
        visible: ["admin", "member","cooperative-admin"],
      },
      {
        icon: "/lesson.png",
        label: "Products Listing",
        href: "/list/productListing",
        visible: [ "member"],
      },
      {
        icon: "/lesson.png",
        label: "Products Purchased",
        href: "/list/productPurchased",
        visible: [ "member"],
      },
      {
        icon: "/assignment.png",
        label: "All Assets",
        href: "/list/allAssetsPage",
        visible: ["super-admin", "admin", "member"],
      },
      {
        icon: "/assignment.png",
        label: "All Loans",
        href: "/list/allLoansPage",
        visible: ["super-admin", "admin", "member"],
      },
      {
        icon: "/assignment.png",
        label: "All Products",
        href: "/list/allProductsPage",
        visible: ["super-admin", "admin", "member"],
      },
      {
        icon: "/result.png",
        label: "Reports",
        href: "/list/generalReports",
        visible: ["admin", "super-admin", "auditor"],
      },
      {
        icon: "/calendar.png",
        label: "Analytics",
        href: "/list/analytics",
        visible: ["admin", "super-admin", "member", "auditor"],
      },
      {
        icon: "/message.png",
        label: "Messages",
        href: "/list/messages",
        visible: ["admin", "super-admin", "member", "auditor"],
      },
      {
        icon: "/announcement.png",
        label: "Announcements",
        href: "/list/announcements",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/profile",
        visible: ["admin", "super-admin", "member", "auditor"],
      },
      {
        icon: "/setting.png",
        label: "Settings",
        href: "/settings",
        visible: ["admin", "super-admin", "member", "auditor"],
      },
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/logout",
        visible: ["admin", "super-admin", "member", "auditor"],
      },
    ],
  },
];

import { auth } from '@/app/api/config';
import { canAccessMenu, fetchUserRole } from '@/lib/roleUtils';
import { browserSessionPersistence, setPersistence } from 'firebase/auth';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Menu = () => {
  const [role, setRole] = useState<string | null>(null);
  const [kycCompleted, setKycCompleted] = useState<boolean>(false);
  const router = useRouter();

  setPersistence(auth, browserSessionPersistence)
  .then(() => {
    // Existing and future Auth states will be persisted
  })
  .catch((error) => {
    console.error("Persistence error: ", error);
  });
  // Fetch user role and KYC status on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const { role, kycCompleted } = await fetchUserRole();
      console.log("Fetched user role:", role);
      setRole(role);
      setKycCompleted(kycCompleted);
    };
    fetchUserData();
  }, []);
  

  // Handle menu item click
  const handleMenuItemClick = async (href: string, requiresKycCheck: boolean) => {
    console.log("Menu item clicked:", href);
    console.log("Current user before navigating:", auth.currentUser);
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        // Force refresh token
        await currentUser.getIdToken(true);
        if (requiresKycCheck && !kycCompleted) {
          router.push('/member-form');
        } else {
          router.push(href);
        }
      } else {
        console.log("User is not authenticated, redirecting to login.");
        router.push('/login');  // Redirect to login if the user is logged out
      }
    } catch (error) {
      console.error("Error refreshing token or navigating:", error);
    }
  };
  

  return (
    <div className="mt-4 text-sm">
      <p>Current role: {role}</p> {/* Display the role */}
      <p>KYC Completed: {kycCompleted ? "Yes" : "No"}</p> {/* Display KYC completion status */}
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            if (canAccessMenu(role, item.visible)) {
              const requiresKycCheck = item.label === "Request Loans"; // Check if it's the "Request Loans" item
              return (
                <div
                  key={item.label}
                  onClick={() => handleMenuItemClick(item.href, requiresKycCheck)}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-neoSkyLight cursor-pointer"
                >
                  <Image src={item.icon} alt="item icon" width={20} height={20} />
                  <span className="hidden lg:block">{item.label}</span>
                </div>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;