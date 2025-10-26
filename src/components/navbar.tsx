"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, LogOut, Menu } from "lucide-react";
import { useGetMe, useLogout } from "@/React-Query/Queries/authQueries";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useDashboardStore } from "./dashboard-store";

export function DashboardNavbar() {
  const { data: user } = useGetMe();
  const { mutate: logOut, isPending } = useLogout();
  const { isCollapsed, setIsMobileOpen, isMobileOpen } = useDashboardStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logOut();
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <header className={cn(
      "flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6",
      !isMobile && (isCollapsed ? "md:ml-0" : "md:ml-0"),
      "transition-all duration-300",
      "dark:bg-gray-800 dark:border-gray-700 dark:text-white" // Dark mode styles
    )}>
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleMobileMenu}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      <div className="flex-1">
        <h1 className="text-lg font-semibold">
          {user?.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
        </h1>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "relative h-8 w-8 rounded-full",
              "dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white" // Dark mode styles for the button
            )}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user?.image}
                alt={user?.name}
                className="dark:border-gray-600" // Optional: Dark border for AvatarImage
              />
              <AvatarFallback className="dark:text-white">
                {user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>

        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuItem
            className="flex items-center gap-2 text-red-600"
            onClick={handleLogout}
            disabled={isPending}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
            {isPending && <Loader2 className="animate-spin h-4 w-4" />}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}