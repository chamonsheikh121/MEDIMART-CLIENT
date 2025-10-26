"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Pill,
  ShoppingCart,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useGetMe } from "@/React-Query/Queries/authQueries";
import { useEffect, useState } from "react";
import { useDashboardStore } from "./dashboard-store";

export function DashboardSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user, isLoading } = useGetMe();
  const [isMobile, setIsMobile] = useState(false);

  const {
    isCollapsed,
    isMobileOpen,
    toggleSidebar,
    closeSidebar,
    setIsMobileOpen
  } = useDashboardStore();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (!mobile) {
        setIsMobileOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobileOpen, router, user]);

  useEffect(() => {
    if (isMobile) {
      closeSidebar();
    }
  }, [pathname, isMobile, closeSidebar]);

  if (!isLoading && user.role !== "admin") {
    router.push("/unauthorized");
  }

  const navItems = [
    {
      href: "/admin",
      icon: LayoutDashboard,
      label: "Overview",
    },
    {
      href: "/admin/medicines",
      icon: Pill,
      label: "Manage Medicines",
    },
    {
      href: "/admin/orders",
      icon: ShoppingCart,
      label: "Manage Orders",
    },
    {
      href: "/admin/users",
      icon: Users,
      label: "Manage Users",
    },
  ];

  return (
    <>
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={cn(
          "border-r bg-muted min-h-screen fixed md:relative z-50 transition-all duration-300",
          isMobile ? "left-0 top-0" : "",
          isMobile ? (isMobileOpen ? "translate-x-0" : "-translate-x-full") : "",
          isCollapsed ? "w-20" : "w-64",
          "dark:bg-gray-800 dark:border-gray-700" // Dark mode background and border
        )}
      >
        <div className="flex h-full flex-col gap-2">
          {!isMobile && (
            <div
              className={cn(
                "flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6",
                isCollapsed ? "justify-center" : "justify-between",
                "dark:border-gray-600"
              )}
            >
              {!isCollapsed && (
                <Link href="/" className="flex items-center gap-2 font-semibold dark:text-white">
                  <span className="text-xl">MediMart</span>
                </Link>
              )}
              <button
                onClick={toggleSidebar}
                className="p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-muted dark:hover:text-primary dark:hover:bg-muted"
              >
                {isCollapsed ? (
                  <ChevronRight size={20} />
                ) : (
                  <ChevronLeft size={20} />
                )}
              </button>
            </div>
          )}

          <div className="flex-1 p-2 overflow-y-auto">
            <nav className="grid items-start gap-1">
              {navItems.map((item) => (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary dark:text-muted-foreground dark:hover:text-primary",
                      pathname === item.href && "bg-primary text-white dark:bg-gray-700 dark:text-white", // Active state in dark mode
                      isCollapsed && !isMobile ? "justify-center" : ""
                    )}
                    title={isCollapsed && !isMobile ? item.label : undefined}
                  >
                    <item.icon className="h-4 w-4" />
                    {(!isCollapsed || isMobile) && item.label}
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          <div className={cn(
            "p-4 border-t flex items-center gap-3",
            isCollapsed && !isMobile ? "justify-center" : "",
            "dark:border-gray-600"
          )}>
            <div className={cn(
              "flex flex-col overflow-hidden transition-all",
              isCollapsed && !isMobile ? "w-0 opacity-0" : "w-full opacity-100"
            )}>
              <span className="font-medium truncate text-white">{user?.name}</span>
              <span className="text-xs text-muted-foreground capitalize truncate dark:text-muted-foreground">
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
