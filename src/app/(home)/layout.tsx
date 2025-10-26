import type { Metadata } from "next";
import Navbar from "@/components/shared/Navbar";
import { CartProvider } from "@/Providers/cart-context-Provider";
import Footer from "@/components/shared/footer";


export const metadata: Metadata = {
  title: "MediMart",
  description: "Buy medicines and healthcare products online with MediMart. Fast delivery, trusted brands, and affordable prices.",
};

export default function HomeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <CartProvider>
          {children}
        </CartProvider>
      </main>
      <Footer/>
    </>
  )
}