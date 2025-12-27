"use client";
import React, { useState, useEffect } from 'react';
import { MdSignalWifiOff } from "react-icons/md"; // Ensure react-icons is installed
import Navbar from './Navbar';

const NoInternet = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // 1. Setup specific event listeners for network changes
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // 2. Add listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 3. Initial Check
    setIsOnline(navigator.onLine);

    // 4. Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // If we are online, don't render anything
  if (isOnline) return null;

  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-[#0f0f0f] text-white">
        <Navbar></Navbar>
      {/* Icon Circle */}
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#1e1e1e]">
        <MdSignalWifiOff className="text-5xl text-gray-400" />
      </div>

      {/* Main Text */}
      <h2 className="mb-2 text-2xl font-bold">Connect to the internet</h2>
      
      {/* Subtext */}
      <p className="mb-8 text-sm text-gray-400">
        You're offline. Check your connection.
      </p>

      {/* YouTube Style Retry Button */}
      <button
        onClick={() => window.location.reload()}
        className="rounded-full border border-[rgba(255,255,255,0.1)] px-8 py-2.5 text-sm font-medium text-[#3ea6ff] hover:bg-[#263850] transition-colors"
      >
        Retry
      </button>
    </div>
  );
};

export default NoInternet;