
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
        href: "/list/loanForm",
        visible: ["admin", "super-admin","auditor","member"],
      },
      {
        icon: "/teacher.png",
        label: "Loans Requested",
        href: "/list/loansRequested",
        visible: ["admin", "super-admin","auditor","cooperative-admin"],
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

import { canAccessMenu, fetchUserRole } from '@/lib/roleUtils';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const Menu = () => {
const [role, setRole] = useState<string | null>(null);

// Fetch user role on component mount
useEffect(() => {
  const getUserRole = async () => {
    const userRole = await fetchUserRole();
    setRole(userRole);
  };

  getUserRole();
}, []);

return (
  <div className="mt-4 text-sm">
    {menuItems.map((i) => (
      <div className="flex flex-col gap-2" key={i.title}>
        <span className="hidden lg:block text-gray-400 font-light my-4">
          {i.title}
        </span>
        {i.items.map((item) => {
          // Use the utility function to check if the user has access to the menu item
          if (canAccessMenu(role, item.visible)) {
            return (
              <Link
                href={item.href}
                key={item.label}
                className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-neoSkyLight"
              >
                <Image src={item.icon} alt="item icon" width={20} height={20} />
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            );
          }
        })}
      </div>
    ))}
  </div>
);
};

export default Menu