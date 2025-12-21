"use client"

import React, { useEffect, useState } from 'react'
import Navbar from '../../Components/Chat/Navbar'
import Chat from '../../Components/Chat/Chat'
import { FaBars } from 'react-icons/fa6'

const App = ({children}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isnewChat, setIsnewChat] = useState(false);


    return (
        <div className="flex max-h-screen relative bg-[#1B1B1F] ">
            {/* 1. Sidebar Component */}
            <Navbar isOpen={isSidebarOpen} isnewChat={isnewChat} setIsnewChat={setIsnewChat} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            {/* 2. Main Content Area */}
            <main className="flex-1 flex flex-col h-full relative w-full">

                {/* Mobile Header (Only shows on small screens) */}
                <div className="md:hidden sticky top-0 flex items-center justify-between p-4 h-10 bg-[#1B1B1F] border-b border-gray-800 z-40">
                    <button onClick={() => setIsSidebarOpen(true)} className="text-gray-300 hover:text-white">
                        <FaBars size={20} />
                    </button>
                    <span className="font-bold text-white">Fusion<span className="text-violet-500 pl-0.5">X</span></span>
                    <div className="w-5" /> {/* Spacer for centering */}
                </div>

                {/* Overlay for mobile sidebar */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* 3. Your Existing Chat Component */}
                <div className="flex-1 h-full w-full">
                    {children}
                </div>

            </main>
        </div>
    )
}

export default App