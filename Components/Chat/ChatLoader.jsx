import React from 'react';

const ChatLoader = () => {
  return (
    <div className="flex flex-col space-y-6 w-full animate-pulse mt-4">
      
      {/* 1. System Message Skeleton */}
      <div className="flex gap-3 items-start justify-start">
        {/* Robot Icon Placeholder */}
        <div className="bg-[#383840] mt-1 p-4 rounded-full rounded-tr-none shadow-md h-8 w-8"></div>
        
        {/* Message Bubble */}
        <div className="flex flex-col gap-2 max-w-[85%] w-[300px]">
           <div className="bg-[#2E2E33] h-16 rounded-2xl rounded-tl-none w-full"></div>
        </div>
      </div>

      {/* 2. User Message Skeleton */}
      <div className="flex gap-3 items-start justify-end">
        {/* Message Bubble */}
        <div className="flex flex-col gap-2 max-w-[85%] w-[200px] items-end">
           <div className="bg-[#4c1d95] opacity-50 h-10 rounded-2xl rounded-tr-none w-full"></div>
        </div>
        {/* User Icon Placeholder */}
        <div className="bg-[#2A2A2E] p-2 rounded-full rounded-tl-none h-8 w-8"></div>
      </div>

      {/* 3. System Message Skeleton (Longer) */}
      <div className="flex gap-3 items-start justify-start">
        <div className="bg-[#383840] mt-1 p-4 rounded-full rounded-tr-none shadow-md h-8 w-8"></div>
        <div className="flex flex-col gap-2 max-w-[85%] w-[450px]">
           <div className="bg-[#2E2E33] h-32 rounded-2xl rounded-tl-none w-full"></div>
        </div>
      </div>

    </div>
  );
};

export default ChatLoader;