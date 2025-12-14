"use client"

import React, { useEffect, useState } from 'react'
import Navbar from '../../Components/Chat/Navbar'
import Chat from '../../Components/Chat/Chat'
import { FaBars } from 'react-icons/fa6'

const App = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);


    return (
        <div className="flex h-screen bg-[#1B1B1F] overflow-hidden">
            {/* 1. Sidebar Component */}
            <Navbar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            {/* 2. Main Content Area */}
            <main className="flex-1 flex flex-col h-full relative w-full">

                {/* Mobile Header (Only shows on small screens) */}
                <div className="md:hidden flex items-center justify-between p-4 mt-2 bg-[#1B1B1F] border-b border-gray-800 z-40">
                    <button onClick={() => setIsSidebarOpen(true)} className="text-gray-300 hover:text-white">
                        <FaBars size={20} />
                    </button>
                    <span className="font-bold text-white">FusionX</span>
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
                    <Chat />
                </div>

            </main>
        </div>
    )
}

export default App