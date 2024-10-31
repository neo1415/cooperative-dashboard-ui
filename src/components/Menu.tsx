"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthCOntext";


const menuItems = [
  {
    title: "MENU",
    items: [
      { icon: "/home.png", label: "Home", href: "/", visible: ["super-admin", "admin", "member", "auditor", "cooperative-admin", "cooperative-auditor"] },
      { icon: "/attendance.png", label: "Cooperatives", href: "/list/cooperatives", visible: ["admin", "super-admin", "auditor"] },
      { icon: "/parent.png", label: "Members", href: "/list/users", visible: ["admin", "super-admin", "auditor", "cooperative-admin"] },
      { icon: "/teacher.png", label: "Request Loans", href: "/loanForm", visible: ["admin", "super-admin", "auditor", "member"] },
      { icon: "/teacher.png", label: "Loans Requested", href: "/list/loansRequested", visible: ["admin", "super-admin", "auditor", "cooperative-admin", "member"] },
      { icon: "/teacher.png", label: "Loans Approved", href: "/list/loansApproved", visible: ["admin", "super-admin", "auditor", "cooperative-admin"] },
      { icon: "/student.png", label: "Assets Requested", href: "/list/assetsRequested", visible: ["admin", "super-admin", "auditor", "cooperative-admin"] },
      { icon: "/student.png", label: "Assets Transferred", href: "/list/assetsTransfered", visible: ["admin", "super-admin", "auditor", "cooperative-admin"] },
      { icon: "/subject.png", label: "Debtors", href: "/list/debtors", visible: ["admin", "super-admin", "cooperative-admin"] },
      { icon: "/class.png", label: "Market Place", href: "/list/marketPlace", visible: ["admin", "member", "cooperative-admin"] },
      { icon: "/lesson.png", label: "My Savings", href: "/Member-savings", visible: ["member"] },
      { icon: "/lesson.png", label: "Member Savings", href: "/savings", visible: ["cooperative-admin"] },
      { icon: "/lesson.png", label: "Products Purchased", href: "/list/productPurchased", visible: ["member"] },
      { icon: "/assignment.png", label: "All Assets", href: "/list/allAssetsPage", visible: ["super-admin", "admin", "member"] },
      { icon: "/assignment.png", label: "All Loans", href: "/list/allLoansPage", visible: ["super-admin", "admin", "member"] },
      { icon: "/assignment.png", label: "All Products", href: "/list/allProductsPage", visible: ["super-admin", "admin", "member"] },
      { icon: "/result.png", label: "Reports", href: "/list/generalReports", visible: ["admin", "super-admin", "auditor"] },
      { icon: "/calendar.png", label: "Analytics", href: "/list/analytics", visible: ["admin", "super-admin", "member", "auditor"] },
      { icon: "/message.png", label: "Messages", href: "/list/messages", visible: ["admin", "super-admin", "member", "auditor"] },
      { icon: "/announcement.png", label: "Announcements", href: "/list/announcements", visible: ["admin", "teacher", "student", "parent"] },
    ],
  },
  {
    title: "OTHER",
    items: [
      { icon: "/profile.png", label: "Profile", href: "/cooperative-profile", visible: ["admin", "super-admin", "cooperative-admin"] },
      { icon: "/profile.png", label: "My-Profile", href: "/member-profile", visible: ["admin", "super-admin","member"] },
      { icon: "/setting.png", label: "Settings", href: "/settings", visible: ["admin", "super-admin", "member", "auditor", "cooperative-admin"] },
      { icon: "/logout.png", label: "Logout", href: "/logout", visible: ["admin", "super-admin", "member", "auditor", "cooperative-admin"] },
    ],
  },
];

const Menu = () => {
  const { role, kycCompleted } = useAuth();
  const router = useRouter();

  const handleMenuItemClick = (href: string, requiresKycCheck: boolean) => {
    if (href === "/logout") {
      localStorage.clear();
      router.push("/login");  // Clear all data and redirect to login
      return;
    }

    if (requiresKycCheck && !kycCompleted) {
      router.push("/member-form")
      // router.push(href.startsWith("/") ? href : `/${href}`);
    } else {
      router.push(href.startsWith("/") ? href : `/${href}`);
    }
  };

  return (
    <div className="mt-4 text-sm">
      <p>Current role: {role}</p>
      <p>KYC Completed: {kycCompleted ? "Yes" : "No"}</p>
      {menuItems.map((section) => (
        <div className="flex flex-col gap-2" key={section.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">{section.title}</span>
          {section.items.map((item) => {
            if (item.visible.includes(role!)) {
              const requiresKycCheck = item.label === "Request Loans";
              return (
                <div
                  key={item.label}
                  onClick={() => handleMenuItemClick(item.href
                    , requiresKycCheck
                  )}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-neoSkyLight cursor-pointer"
                >
                  <Image src={item.icon} alt="item icon" width={20} height={20} />
                  <span className="hidden lg:block">{item.label}</span>
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