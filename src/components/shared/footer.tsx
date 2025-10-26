'use client';

import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-950 text-gray-700 dark:text-gray-300 pt-12 pb-6 border-t dark:border-gray-800">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Info */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">MediMart</h3>
          <p className="text-sm">
            Your trusted partner for quality medical supplies. We ensure fast delivery and customer satisfaction.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li><Link href="/about" className="hover:underline">About Us</Link></li>
            <li><Link href="/shop" className="hover:underline">Shop</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Support</h4>
          <ul className="space-y-1 text-sm">
            <li><Link href="/faq" className="hover:underline">FAQ</Link></li>
            <li><Link href="/terms" className="hover:underline">Terms & Conditions</Link></li>
            <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Contact Us</h4>
          <p className="text-sm mb-1">📍 123 Health Street, Dhaka, BD</p>
          <p className="text-sm mb-1">📞 +880 123 456 789</p>
          <p className="text-sm">✉️ support@medimart.com</p>
          <div className="flex gap-4 mt-4">
            <Link href="#"><Facebook className="w-5 h-5 hover:text-blue-500" /></Link>
            <Link href="#"><Twitter className="w-5 h-5 hover:text-blue-400" /></Link>
            <Link href="#"><Instagram className="w-5 h-5 hover:text-pink-500" /></Link>
            <Link href="#"><Linkedin className="w-5 h-5 hover:text-blue-700" /></Link>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 border-t border-gray-300 dark:border-gray-800 pt-4 text-center text-sm text-gray-600 dark:text-gray-500">
        © {new Date().getFullYear()} MediMart. All rights reserved.
      </div>
    </footer>
  );
}
