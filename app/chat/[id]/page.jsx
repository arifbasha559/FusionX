"use client"

import React, { useState, useEffect } from 'react'
import Navbar from '../../../Components/Chat/Navbar' // Assuming this is your Sidebar
import Chat from '../../../Components/Chat/Chat'
import { FaBars } from 'react-icons/fa6'
import { useParams, useRouter } from 'next/navigation'
// No need to import useParams here, strictly speaking, if Chat handles it.

const ChatPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isnewChat, setIsnewChat] = useState(false);
    const router = useRouter();
    const params = useParams();
    const chatId = params.id;

    useEffect(() => {
        const savedChats = localStorage.getItem("chats");

        if (chatId) {
            // 1. Parse the string back into an array
            const chats = savedChats ? JSON.parse(savedChats) : [];

            // 2. Check if a chat with this specific ID exists
            // (Assuming your chats are objects like { id: "123", title: "..." })
            const chatExists = chats.some(chat => chat.id === chatId);

            // 3. If it doesn't exist, redirect
            if (!chatExists) {
                router.push("/chat");
            }
        }
    }, [chatId, router]);
    return (
        <div className="flex h-screen bg-[#1B1B1F] overflow-hidden">
            {/* 1. Sidebar Component */}
            <Navbar
                isOpen={isSidebarOpen}
                isnewChat={isnewChat}
                setIsnewChat={setIsnewChat}
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            {/* 2. Main Content Area */}
            <main className="flex-1 flex flex-col h-full relative w-full">

                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-4 mt-2 bg-[#1B1B1F] border-b border-gray-800 z-40">
                    <button onClick={() => setIsSidebarOpen(true)} className="text-gray-300 hover:text-white">
                        <FaBars size={20} />
                    </button>
                    <span className="font-bold text-white">FusionX</span>
                    <div className="w-5" />
                </div>

                {/* Overlay for mobile sidebar */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* 3. Chat Component */}
                <div className="flex-1 h-full w-full">
                    {/* The Chat component will self-configure based on the URL */}
                    <Chat />
                </div>

            </main>
        </div>
    )
}

export default ChatPage