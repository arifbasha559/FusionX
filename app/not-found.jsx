import React from 'react';
import Link from 'next/link';
import { FaRobot, FaArrowLeft, FaHouse, FaGithub } from "react-icons/fa6";
import Navbar from '@/Components/Navbar';
import { LuTerminal } from 'react-icons/lu';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#171719] text-white flex flex-col items-center  text-center">
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

                        {/* Authentication Buttons */}

                    </div>
                </div>
            </nav>
            {/* Glitchy 404 Text */}
            <div className="flex flex-col justify-center items-center size-full my-auto">

                <div className="relative mb-8">
                    <h1 className="text-9xl font-black text-[#212121] select-none">404</h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <FaRobot className="text-6xl text-violet-600 animate-bounce" />
                    </div>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Signal Lost in the Void
                </h2>

                <p className="text-gray-400 max-w-md mx-auto mb-10 text-lg">
                    Even our most advanced AI models couldn&#39;t hallucinate this page for you. It seems you&#39;ve ventured into uncharted territory.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-[#2A2A2E] hover:bg-[#323236] text-white rounded-xl font-medium transition-all border border-gray-700"
                    >
                        <FaHouse /> Return Home
                    </Link>

                    <Link
                        href="/chat"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-violet-900/20"
                    >
                        <FaArrowLeft /> Back to Chat
                    </Link>
                </div>
            </div>
        </div>
    );
}