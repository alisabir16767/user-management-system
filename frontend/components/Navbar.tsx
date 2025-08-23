"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setRole(payload.role);
      } catch {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setRole(null);
      }
    } else {
      setIsLoggedIn(false);
      setRole(null);
    }
  };

  useEffect(() => {
    checkAuth();

    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setRole(null);

    window.dispatchEvent(new Event("storage"));

    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6 py-3">
        <Link
          href="/"
          className="text-2xl font-bold text-purple-700 hover:text-purple-900"
        >
          SmallBus
        </Link>

        <div className="flex space-x-4 items-center">
          <Link href="/" className="text-black hover:text-purple-600">
            Home
          </Link>

          {isLoggedIn && role === "admin" && (
            <Link href="/admin" className="text-black hover:text-purple-600">
              Admin Panel
            </Link>
          )}

          {!isLoggedIn ? (
            <>
              <Link href="/login" className="text-black hover:text-purple-600">
                Login
              </Link>
              <Link href="/signup" className="text-black hover:text-purple-600">
                Signup
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
