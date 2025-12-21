"use client";

import React, { useEffect, useState } from 'react';
import { FaPlus, FaGithub, FaDiscord, FaInfo } from "react-icons/fa6";
import { LuTerminal } from "react-icons/lu";
import { BiMessageSquareDetail, BiTrash } from "react-icons/bi";
import Link from 'next/link';
import { FaHome } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { useParams, useRouter } from 'next/navigation';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';

const Sidebar = ({ isOpen, toggleSidebar, isnewChat, setIsnewChat }) => {
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  const params = useParams();

  // Unified function to load chats
  const loadChats = async () => {
    // 1. SILENT LOADING: Only show spinner if we have NO data.
    // This prevents the list from flashing/disappearing when you switch chats.
    if (chats.length === 0) setIsLoading(true);
    
    try {
      if (isSignedIn) {
        const response = await fetch('/api/chat/list');
        if (response.ok) {
          const data = await response.json();
          setChats(data);
        }
      } else {
        const storedChats = localStorage.getItem('chats');
        if (storedChats) {
          setChats(JSON.parse(storedChats));
        } else {
          setChats([]);
        }
      }
    } catch (error) {
      console.error("Failed to load chats:", error);
    } finally {
      setIsLoading(false);
    }
  };

 useEffect(() => {
    loadChats(); // Initial Load

    // Listen for the custom event (triggered when Chat.jsx saves to DB)
    const handleChatUpdate = () => loadChats();
    window.addEventListener('chatListUpdated', handleChatUpdate);
    window.addEventListener('storage', handleChatUpdate);

    return () => {
      window.removeEventListener('chatListUpdated', handleChatUpdate);
      window.removeEventListener('storage', handleChatUpdate);
    };
    
    // 👇 DEPENDENCIES FIXED: 
    // We removed 'isnewChat'. Now, clicking the + button won't force a re-fetch.
    // The list will ONLY update if:
    // 1. You Log In/Out (isSignedIn changes)
    // 2. A chat is actually saved to the DB (chatListUpdated event fires)
  }, [isSignedIn]);

  // ... rest of your return code (JSX) ...
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
          
          {isLoading && chats.length === 0 ? ( // Only show if loading AND empty
             <p className="px-4 text-xs text-gray-500 animate-pulse">Loading history...</p>
          ) : (
            <div className="space-y-1">
              {chats.length > 0 ? (
                chats.map((item, i) => {
                  const chatId = item._id || item.id; 
                  return (
                    <div
                      key={chatId || i}
                      // Use params.id to highlight active chat WITHOUT re-fetching
                      className={`group flex items-center justify-between w-full px-4 py-3 ${params?.id === chatId ? "bg-gray-800/80" : "bg-inherit"} text-gray-300 hover:bg-gray-800/50 hover:text-white rounded-lg transition-all text-sm cursor-pointer`}
                      onClick={() => {
                        router.push(`/chat/${chatId}`);
                        if (window.innerWidth < 768) toggleSidebar();
                      }}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <BiMessageSquareDetail className="text-gray-500 group-hover:text-violet-400 shrink-0" />
                        <span className="truncate max-w-[130px]" title={item.title}>{item.title || "Untitled Chat"}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div>
                  <p className="px-4 py-2 text-xs font-medium text-gray-600 italic">No chat history found.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation (Keep your existing footer code here) */}
        <div className="mt-6 border-t border-gray-800 pt-4 space-y-1">
             {/* ... paste your existing footer links/UserButton code here ... */}
             <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm">
                <FaHome /> Home
             </Link>
             <Link href="/about" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm">
                <FaInfo /> About Us
             </Link>
             {isSignedIn && user ? (
                <div className="flex items-center gap-3 px-2 py-2 pt-4 rounded-lg border-t border-gray-800 mb-4">
                  <UserButton appearance={{ elements: { userButtonAvatarBox: "hidden", userButtonPopoverFooter: "hidden" }}} />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm text-white font-medium truncate">{user.fullName}</span>
                    <span className="text-xs text-gray-400 truncate">{user.primaryEmailAddress?.emailAddress}</span>
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <SignInButton mode="modal">
                    <button className="w-full bg-violet-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-violet-700 transition">
                      Sign In to Save Chats
                    </button>
                  </SignInButton>
                </div>
              )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;