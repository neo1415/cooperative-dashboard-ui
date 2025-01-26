"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthCOntext";


const menuItems = [
  {
    title: "MENU",
    items: [
      { icon: "/home.png", label: "Home", href: "/", visible: ["super-admin", "admin", "member", "auditor", "cooperative-admin", "cooperative-auditor"] },
      { icon: "/attendance.png", label: "Cooperatives", href: "/list/cooperatives", visible: [ "super-admin", "auditor"] },
      { icon: "/parent.png", label: "Members", href: "/list/users", visible: ["admin", "super-admin", "auditor", "cooperative-admin"] },
      { icon: "/teacher.png", label: "Loans", href: "/list/loansRequested", visible: ["admin", "super-admin", "auditor", "member"] },
      { icon: "/teacher.png", label: "Member Loans", href: "/list/loansRequested", visible: ["admin", "super-admin", "auditor", "cooperative-admin"] },
      { icon: "/teacher.png", label: "Loans Approved", href: "/list/loansApproved", visible: ["admin", "super-admin", "auditor", "cooperative-admin"] },
      { icon: "/student.png", label: "Assets Requested", href: "/list/assetsRequested", visible: ["admin", "super-admin", "auditor", "cooperative-admin", "member"] },
      { icon: "/student.png", label: "Assets", href: "/list/assets", visible: ["admin", "super-admin", "auditor", "cooperative-admin", 'member'] },
      { icon: "/subject.png", label: "Debtors", href: "/list/debtors", visible: ["admin", "super-admin", "cooperative-admin"] },
      { icon: "/lesson.png", label: "My Transactions", href: "/Member-savings", visible: ["member"] },
      // { icon: "/class.png", label: "Market Place", href: "/list/marketPlace", visible: ["admin", "member", "cooperative-admin"] },
    
      { icon: "/lesson.png", label: "Member Savings", href: "/member-transactions", visible: ["cooperative-admin"] },
      // { icon: "/lesson.png", label: "Products Purchased", href: "/list/productPurchased", visible: ["member"] },
      // { icon: "/assignment.png", label: "All Assets", href: "/list/allAssetsPage", visible: ["super-admin", "admin", "member"] },
      // { icon: "/assignment.png", label: "All Loans", href: "/list/allLoansPage", visible: ["super-admin", "admin", "member"] },
      // { icon: "/assignment.png", label: "All Products", href: "/list/allProductsPage", visible: ["super-admin", "admin", "member"] },
      { icon: "/result.png", label: "Reports", href: "/list/reports", visible: ["cooperative-admin", "super-admin", "auditor", "member"] },
      // { icon: "/calendar.png", label: "Analytics", href: "/list/analytics", visible: ["admin", "super-admin", "member", "auditor"] },
      // { icon: "/message.png", label: "Messages", href: "/list/messages", visible: ["admin", "super-admin", "member", "auditor"] },
      // { icon: "/announcement.png", label: "Announcements", href: "/list/announcements", visible: ["admin", "teacher", "student", "parent"] },
    ],
  },
  {
    title: "OTHER",
    items: [
      { icon: "/profile.png", label: "Profile", href: "/cooperative-profile", visible: ["admin", "super-admin", "cooperative-admin", "member"] },
      // { icon: "/profile.png", label: "My-Profile", href: "/member-profile", visible: ["admin", "super-admin","member"] },
      { icon: "/setting.png", label: "Settings", href: "/settings", visible: ["admin", "super-admin", "auditor", "cooperative-admin"] },
      { icon: "/logout.png", label: "Logout", href: "/logout", visible: ["admin", "super-admin", "member", "auditor", "cooperative-admin"] },
    ],
  },
];

const Menu = () => {
  const { role, kycCompleted } = useAuth();
  const router = useRouter();

  const handleMenuItemClick = (href: string) => {
    if (role === "member" && !kycCompleted) {
      router.push("/member-form");
      return;
    }

    if (href === "/logout") {
      return;
    }

    router.push(href.startsWith("/") ? href : `/${href}`);
  };

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((section) => (
        <div className="flex flex-col gap-2" key={section.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">{section.title}</span>
          {section.items.map((item) => {
            if (item.visible.includes(role!)) {
              return (
                <div
                  key={item.label}
                  onClick={() => handleMenuItemClick(item.href)}
                  className="flex items-center justify-center lg:justify-start gap-2 md:gap-4 text-gray-500 py-2 px-2 md:px-3 rounded-md hover:bg-neoSkyLight cursor-pointer transition-all duration-200 ease-in-out"
                >
                  <Image
                    src={item.icon}
                    alt="item icon"
                    width={24} // Adjust width for responsiveness
                    height={24} // Adjust height for responsiveness
                    className="md:w-6 md:h-6 lg:w-8 lg:h-8 transition-all duration-200"
                  />
                  <span className="text-xs md:text-sm lg:text-base hidden md:block">{item.label}</span>
                </div>
              );
            }
            return null;
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;