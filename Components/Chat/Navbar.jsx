"use client";

import React, { useEffect, useState } from 'react';
import { FaPlus, FaGithub, FaDiscord, FaInfo } from "react-icons/fa6";
import { LuTerminal } from "react-icons/lu";
import { BiMessageSquareDetail, BiTrash } from "react-icons/bi";
import Link from 'next/link';
import { FaHome } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { useRouter } from 'next/navigation';

const Sidebar = ({ isOpen, toggleSidebar, isnewChat, setIsnewChat }) => {
  const [chats, setChats] = useState([]);
  const router = useRouter();

  // Function to load chats from local storage
  const loadChats = () => {
    try {
      const storedChats = localStorage.getItem('chats');
      if (storedChats) {
        setChats(JSON.parse(storedChats));
      } else {
        setChats([]);
      }
    } catch (error) {
      console.error("Failed to parse chats from localStorage:", error);
      setChats([]);
    }
  };

  useEffect(() => {
    // 1. Load initially
    loadChats();

    // 2. Define the event handler
    const handleChatUpdate = () => loadChats();

    // 3. Listen for the custom event (triggered by Chat.jsx)
    window.addEventListener('chatListUpdated', handleChatUpdate);
    
    // 4. Listen for storage changes (if you have multiple tabs open)
    window.addEventListener('storage', handleChatUpdate);

    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener('chatListUpdated', handleChatUpdate);
      window.removeEventListener('storage', handleChatUpdate);
    };

  }, [isnewChat, isOpen]); // Keep dependencies if you use them elsewhere

  const handleDeleteChat = (e, id) => {
    e.stopPropagation();
    const updatedChats = chats.filter(chat => chat.id !== id);
    localStorage.setItem('chats', JSON.stringify(updatedChats));
    setChats(updatedChats);
  };

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
            <LuTerminal className='text-white text-xl' />
          </div>
          <h1 className="text-white font-bold text-xl tracking-wide">Fusion<span className="text-violet-500">X</span></h1>
          <IoClose onClick={toggleSidebar} className="text-white text-lg cursor-pointer ml-auto md:hidden " />
        </div>

        {/* New Chat Button */}
        <Link
          href={"/chat"}
          onClick={() => {
            if (setIsnewChat) setIsnewChat(prev => !prev);
            if (window.innerWidth < 768) toggleSidebar();
          }}
          className="flex items-center gap-3 w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700 mb-6"
        >
          <FaPlus className="text-sm" />
          <span className="text-sm font-medium">New Chat</span>
        </Link>

        {/* History List */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <p className="px-4 text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Recent</p>
          <div className="space-y-1">
            {chats.length > 0 ? (
              chats.map((item, i) => (
                <div
                  key={item.id || i}
                  className="group flex items-center justify-between w-full px-4 py-3 text-gray-300 hover:bg-gray-800/50 hover:text-white rounded-lg transition-all text-sm cursor-pointer"
                  onClick={() => {
                    router.push(`/chat/${item.id}`);
                    if (window.innerWidth < 768) toggleSidebar();
                  }}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <BiMessageSquareDetail className="text-gray-500 group-hover:text-violet-400 flex-shrink-0" />
                    <span className="truncate max-w-[130px]">{item.title || "Untitled Chat"}</span>
                  </div>

                  <button
                    onClick={(e) => handleDeleteChat(e, item.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity"
                    title="Delete Chat"
                  >
                    <BiTrash />
                  </button>
                </div>
              ))
            ) : (
              <div>
                <p className="px-4 py-2 text-xs font-medium text-gray-600 italic">No chat history found.</p>
              </div>
            )}
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
            <FaInfo /> About Us
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;