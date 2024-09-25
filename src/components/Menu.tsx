const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/",
        visible: ["super-admin", "admin", "member", "auditor"],
      },
      {
        icon: "/teacher.png",
        label: "Loans",
        href: "/list/loans",
        visible: ["admin", "super-admin","auditor"],
      },
      {
        icon: "/student.png",
        label: "Assets",
        href: "/list/assets",
        visible: ["admin", "super-admin", "auditor"],
      },
      {
        icon: "/parent.png",
        label: "Approved Loans",
        href: "/list/parents",
        visible: ["admin", "super-admin", "auditor"],
      },
      {
        icon: "/subject.png",
        label: "Reports",
        href: "/list/subjects",
        visible: ["admin", "super-admin"],
      },
      {
        icon: "/class.png",
        label: "My Loans",
        href: "/list/my-loans",
        visible: [ "member"],
      },
      {
        icon: "/lesson.png",
        label: "Loan Status",
        href: "/list/loan-status",
        visible: [ "member"],
      },
      {
        icon: "/exam.png",
        label: "Market Place",
        href: "/list/market-place",
        visible: ["admin", "super-admin", "auditor", "member"],
      },
      {
        icon: "/assignment.png",
        label: "Order Management",
        href: "/list/order-management",
        visible: ["super-admin", "admin", "member"],
      },
      {
        icon: "/result.png",
        label: "Reports",
        href: "/list/reports",
        visible: ["admin", "super-admin", "auditor"],
      },
      {
        icon: "/attendance.png",
        label: "Cooperatives",
        href: "/list/cooperatives",
        visible: ["admin", "super-admin", "auditor"],
      },
      {
        icon: "/calendar.png",
        label: "Events",
        href: "/list/events",
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

import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const Menu = () => {
  return (
    <div className='mt-4 text-sm'>
      {menuItems.map((i) => (
        <div className='flex flex-col gap-2' key={i.title}>
          <span className='hidden lg:block text-gray-400 font-light my-4'>{i.title}</span>
          {i.items.map ((item) =>(
            <Link
             href ={item.href} 
             key={item.label}
            className='flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2'>
              <Image src={item.icon} alt='link ' height={20} width={20} />
              <span className='hidden lg:block'>{item.label}</span>
            </Link>
          ))}
        </div>
      ))}
    </div>
  )
}

export default Menu