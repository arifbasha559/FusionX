"use client";
import React from 'react';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa6';
import { LuTerminal } from "react-icons/lu";
import { SignInButton, UserButton, SignedIn, SignedOut } from '@clerk/nextjs';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#121212]/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center group-hover:bg-violet-500 transition-colors">
             <LuTerminal className='text-white text-xl' />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">
            Fusion<span className="text-violet-500">X</span>
          </span>
        </Link>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* GitHub Link */}
          <a 
            href="https://github.com/yourusername" 
            target="_blank" 
            rel="noreferrer"
            className="text-gray-400 hover:text-white transition-colors text-xl"
            title="View on GitHub"
          >
            <FaGithub />
          </a>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-700"></div>

          {/* Authentication Buttons */}
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-sm font-medium bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-8 h-8 border  border-gray-700"
                }
              }}
            />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;