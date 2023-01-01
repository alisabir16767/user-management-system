"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        {/* Brand / Logo */}
        <h2 className="text-lg font-semibold text-white">SmallBus</h2>

        {/* Links */}
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <Link href="/about" className="hover:text-white">
            About
          </Link>
          <Link href="/contact" className="hover:text-white">
            Contact
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-sm text-gray-500 mt-4 md:mt-0">
          © {new Date().getFullYear()} SmallBus. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
