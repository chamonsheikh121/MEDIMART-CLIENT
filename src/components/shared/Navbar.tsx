/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";
import { Loader2, LogOut, Package, Search, Settings, User, X } from "lucide-react";

// Components
import MobileMenu from "./MobileMenu";
import { ModeToggle } from "../ThemeToggler";
import { Button } from "@/components/ui/button";
import CartIcon from "./cartIcon";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

// Hooks
import { useGetMe, useLogout } from "@/React-Query/Queries/authQueries";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user } = useGetMe(false);
  const { mutate: logOut, isPending } = useLogout();
  
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Products' },
    { href: '/about', label: 'About' },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus search input when shown
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const handleLogout = () => {
    logOut();
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setSearchQuery("");
    }
  };

  const handleSearchSubmit = (e:any) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
    }
  };

  const handleKeyDown = (e:any) => {
    if (e.key === "Escape") {
      setShowSearch(false);
    }
  };

  return (
    <nav 
      className={clsx(
        "w-full fixed top-0 left-0 z-50 transition-all duration-300",
        "bg-white dark:bg-gray-900",
        isScrolled 
          ? "shadow-md dark:shadow-lg py-2" 
          : "py-3"
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative h-10 w-10 overflow-hidden rounded-md">
            <Image
              src="/logo.jpg"
              alt="MediMart Logo"
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">MediMart</span>
        </Link>

        {/* Search Bar (expanded) */}
        {showSearch ? (
          <form 
            onSubmit={handleSearchSubmit} 
            className="absolute left-0 top-0 w-full h-full bg-white dark:bg-gray-900 z-10 flex items-center px-4 md:px-6 animate-in fade-in slide-in-from-top-4 duration-200"
          >
            <div className="relative flex-1 mx-auto max-w-2xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input 
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for medications, supplements, and more..."
                className="pl-10 pr-20 h-10 w-full focus-visible:ring-blue-500"
                onKeyDown={handleKeyDown}
              />
              <div className="absolute right-0 top-0 h-full flex items-center space-x-1 pr-1">
                {searchQuery && (
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  type="submit"
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={!searchQuery.trim()}
                >
                  Search
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 ml-2 flex-shrink-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={toggleSearch}
            >
              <X className="h-5 w-5" />
            </Button>
          </form>
        ) : (
          <>
            {/* Navigation Links */}
            <ul className="hidden md:flex space-x-8 font-medium">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={clsx(
                      'transition relative py-1',
                      'hover:text-blue-600 dark:hover:text-blue-400',
                      pathname === href
                        ? 'text-blue-600 dark:text-blue-400 after:content-[""] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-blue-600 dark:after:bg-blue-400'
                        : 'text-gray-700 dark:text-gray-200'
                    )}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                onClick={toggleSearch}
              >
                <Search className="h-5 w-5" />
              </Button>

              <CartIcon />

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                      <Avatar className="h-9 w-9 border-2 border-white dark:border-gray-800 shadow-sm">
                        <AvatarImage src={user?.profileImage?.url} alt={user?.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-medium">
                          {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-56 mt-1 p-1" align="end" forceMount>
                    <div className="p-2">
                      <p className="font-medium truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    
                    {user?.role !== 'admin' && (
                      <>
                        <DropdownMenuItem
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() => router.push('/profile')}
                        >
                          <User className="h-4 w-4" />
                          <span>My Profile</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() => router.push('/orders')}
                        >
                          <Package className="h-4 w-4" />
                          <span>My Orders</span>
                        </DropdownMenuItem>
                      </>
                    )}

                    {user?.role === 'admin' && (
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => router.push('/admin')}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem
                      className="flex items-center gap-2 text-red-600 dark:text-red-400 cursor-pointer focus:text-red-700 dark:focus:text-red-300"
                      onClick={handleLogout}
                      disabled={isPending}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                      {isPending && <Loader2 className="ml-auto animate-spin h-4 w-4" />}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
                  onClick={() => router.push('/log-in')}
                >
                  Log In
                </Button>
              )}

              <ModeToggle />
              <div className="md:hidden">
                <MobileMenu />
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;