'use client'; // Make this a client component

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getSession } from 'next-auth/react';
import UserAccountNav from './UserAccountNav';

const Navbar = () => {
  const [session, setSession] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Toggle mobile menu
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession();
      setSession(sessionData);
    };
    fetchSession();

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    setIsMounted(true);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (!isMounted) return null;

  return (
    <nav
      className={`py-4 shadow-md fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-lg bg-transparent' : 'bg-[#f8edeb]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3">
          <Image src="/logo.png" alt="MyApp Logo" width={40} height={40} />
        </Link>

        <div className="hidden md:flex items-center space-x-6 text-base font-medium">
          {session?.user ? (
            <UserAccountNav />
          ) : (
            <>
              <Link
                href="/register"
                className="hover:bg-yellow-200 hover:text-white hover:font-bold text-gray-800 py-2 px-4 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Register
              </Link>
              <Link
                href="/login"
                className="hover:bg-yellow-200 hover:text-white hover:font-bold text-gray-800 py-2 px-4 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Login
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-black focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-0 right-0 mt-9 mr-4 bg-transparent text-white p-4 z-10">
          <div className="space-y-4 rounded shadow-xl backdrop-blur-lg p-4 border border-gray-200">
            {session?.user ? (
              <UserAccountNav />
            ) : (
              <>
                <Link
                  href="/register"
                  className="block font-medium transition duration-300 hover:bg-yellow-200 hover:text-white hover:font-bold text-gray-800 py-2 px-4 rounded-full ease-in-out transform hover:scale-105"
                >
                  Register
                </Link>
                <Link
                  href="/login"
                  className="block font-medium transition duration-300 hover:bg-yellow-200 hover:text-white hover:font-bold text-gray-800 py-2 px-4 rounded-full ease-in-out transform hover:scale-105"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
