import type { Metadata } from "next";
import { DashboardSidebar } from "@/components/sidebar";
import { DashboardNavbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Monitor sales, manage products, and track orders efficiently on the MediMart dashboard.",
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen dark:bg-gray-900 dark:text-white">
      <DashboardSidebar />
      
      <div className="flex flex-col w-full transition-all duration-300 h-screen">
        <DashboardNavbar />
        
        <main className="flex-1 p-4 md:p-6 overflow-auto bg-gray-50 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
