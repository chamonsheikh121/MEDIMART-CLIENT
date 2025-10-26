"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const MobileMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>

      <button
        className="md:hidden"
        onClick={() => setMenuOpen(true)}
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>


      <div
        className={`fixed inset-0 bg-black/40 bg-opacity-40  w-full transition-opacity duration-300 ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMenuOpen(false)}
      />


      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >

        <button
          className="absolute top-4 right-4 text-gray-600"
          onClick={() => setMenuOpen(false)}
        >
          <X className="w-6 h-6" />
        </button>


        <ul className="flex flex-col items-start space-y-6 p-6 font-semibold">
          <li>
            <Link href="/" className="text-gray-700 hover:text-blue-500 transition" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/products" className="text-gray-700 hover:text-blue-500 transition" onClick={() => setMenuOpen(false)}>
              Products
            </Link>
          </li>
          <li>
            <Link href="/about" className="text-gray-700 hover:text-blue-500 transition" onClick={() => setMenuOpen(false)}>
              About
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default MobileMenu;
