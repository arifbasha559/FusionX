"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBars, FaXmark, FaGithub } from "react-icons/fa6";
import { LuTerminal } from 'react-icons/lu';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
 

  const isActive = (path) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#171719]/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-violet-600/10 hover:bg-violet-600/40 rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:scale-105 transition-all duration-300 ease-in-out">
              <LuTerminal className='text-white text-xl' />

            </div>
            <span className="text-white font-bold text-lg tracking-wide group-hover:text-violet-400 transition-all duration-300 ease-in-out">
              FusionX
            </span>
          </Link>

          {/* Desktop Nav */}


          {/* Github Icon (Desktop) */}
          <div className="">
            <a
              href="https://github.com/arifbasha559/FusionX"
              target="_blank"
              rel="noreferrer"
              title='FusionX'
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaGithub size={20} />
            </a>
          </div>


        </div>
      </div>


    </nav>
  );
};

export default Navbar;