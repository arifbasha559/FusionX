// src/components/Sidebar.jsx
import React from 'react';
import { FaPlus, FaGithub, FaDiscord, FaInfo } from "react-icons/fa6";
import { BiMessageSquareDetail } from "react-icons/bi";
import Link from 'next/link';
import { FaHome } from 'react-icons/fa';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#171719] border-r border-gray-800 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0
      `}
    >
      <div className="flex flex-col h-full p-4">
        {/* Logo Area */}
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <h1 className="text-white font-bold text-xl tracking-wide">Fusion<span className="text-violet-500">X</span></h1>
        </div>

        {/* New Chat Button */}
        <button
          onClick={() => window.location.reload()} // Simple reload to clear chat for now
          className="flex items-center gap-3 w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700 mb-6"
        >
          <FaPlus className="text-sm" />
          <span className="text-sm font-medium">New Chat</span>
        </button>

        {/* History List (Placeholder) */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <p className="px-4 text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Recent</p>
          <div className="space-y-1">
            {['React Debugging', 'Python Script', 'Image Gen Idea'].map((item, i) => (
              <button key={i} className="flex items-center gap-3 w-full px-4 py-3 text-gray-300 hover:bg-gray-800/50 hover:text-white rounded-lg transition-all text-sm group">
                <BiMessageSquareDetail className="text-gray-500 group-hover:text-violet-400" />
                <span className="truncate">{item}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer Links */}
        <div className="border-t border-gray-800 pt-4 mt-2">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors text-sm">
            <FaGithub />
            <span>GitHub</span>
          </a>
          <a href="https://discord.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors text-sm">
            <FaDiscord />
            <span>Discord</span>
          </a>
        </div>
       
        {/* Navigation Links */}
        <div className="mt-6 border-t border-gray-800 pt-4 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm">
            <FaHome /> Home
          </Link>
          <Link href="/about" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm">
            <FaInfo/> About Us
          </Link>
          <Link href="/contact" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm">
            <span>📧</span> Contact
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;