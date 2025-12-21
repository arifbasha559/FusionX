"use client";
import React, { useEffect, useRef, useState } from "react";
import { BiMicrophone, BiImage, BiText, BiBot } from "react-icons/bi";
import { FaStop } from "react-icons/fa6";
import { IoSendSharp, IoTimeOutline } from "react-icons/io5";
import { MdKeyboardArrowDown } from "react-icons/md";
const Input = ({
    input, setInput,
    handleSend, handleKeyPress,
    model, models, setModel,
    mode, setMode,
    responseTime, setResponseTime,
    isTyping, stopGeneration
}) => {
    const textareaRef = useRef(null);

    // State to track which menu is open: 'model' | 'time' | null
    const [activeMenu, setActiveMenu] = useState(null);

    // Refs to detect clicks outside
    const modelMenuRef = useRef(null);
    const timeMenuRef = useRef(null);

    // Auto resize textarea
    const handleChange = (e) => {
        const el = textareaRef.current;
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, 10 * 25) + "px";
        setInput(e.target.value);
    };

    // Global click listener to close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // If Model menu is open and click is outside it
            if (activeMenu === 'model' && modelMenuRef.current && !modelMenuRef.current.contains(event.target)) {
                setActiveMenu(null);
            }
            // If Time menu is open and click is outside it
            if (activeMenu === 'time' && timeMenuRef.current && !timeMenuRef.current.contains(event.target)) {
                setActiveMenu(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [activeMenu]);

    // Handle Enter key
    useEffect(() => {
        const handleGlobalKeyDown = (e) => {
            const active = document.activeElement;
            if (active === textareaRef.current) return;
            if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
            e.preventDefault();
            if (textareaRef.current) {
                textareaRef.current.focus();
                setTimeout(() => {
                    setInput((prev) => prev + e.key);
                }, 0);
            }
        };

        window.addEventListener("keydown", handleGlobalKeyDown);
        return () => window.removeEventListener("keydown", handleGlobalKeyDown);
    }, [setInput]);

    const toggleMenu = (menu) => {
        setActiveMenu(activeMenu === menu ? null : menu);
    };

    return (
        <div className="w-full">

            <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col gap-1  w-full px-4 py-3 border border-gray-700 rounded-xl bg-[#1B1B1F] text-white 
                focus-within:ring-2 focus-within:ring-violet-500/50 transition-all duration-200"
            >
                {/* Text Area */}
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleChange}
                    onKeyDown={handleKeyPress}
                    // Update placeholder to show status
                    placeholder={
                        isTyping
                            ? "AI is answering... (Enter to send is disabled)"
                            : (mode === 'image' ? "Describe the image you want to generate..." : "Type your message...")
                    }
                    className={`outline-none w-full resize-none scrollbar bg-transparent text-sm md:text-base scrollbar [&::-webkit-scrollbar-button]:hidden placeholder-gray-500 ${isTyping ? "opacity-80" : ""}`}
                    rows="1"
                    maxLength={2000}
                    style={{ minHeight: "2.5rem", maxHeight: "10rem", scrollbarColor: '#fff #2A2A30', scrollbarWidth: 'thin' }}
                />

                {/* Bottom Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-700/50 relative">

                    {/* LEFT SIDE: Settings */}
                    <div className="flex flex-wrap items-center gap-2">

                        {/* 1. Model Selector (Click to Open) */}
                        <div className="relative" ref={modelMenuRef}>
                            <button
                                type="button"
                                onClick={() => toggleMenu('model')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-300 bg-[#2A2A30] hover:bg-[#36363E] rounded-lg transition-colors border ${activeMenu === 'model' ? 'border-violet-500 ring-1 ring-violet-500/50' : 'border-gray-700/50'}`}
                            >
                                <BiBot size={16} className="text-violet-400" />
                                <span className=" truncate md:hidden">{model.slice(0, 2) || 'Select Model'}</span>
                                <span className="md:max-w-20 hidden md:inline  truncate">{model || 'Select Model'}</span>
                                <MdKeyboardArrowDown className={`transition-transform duration-200 ${activeMenu === 'model' ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {activeMenu === 'model' && (
                                <div className="absolute bottom-full left-0 mb-2 w-36 bg-[#1B1B1F] border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                                    <div className="py-1"> {/* Added a wrapper div for padding control */}
                                        {models.map((mod, index) => (
                                            <React.Fragment key={index}>

                                                {/* LOGIC: Inject separator before the last 2 items */}
                                                {index === models.length - 2 && (
                                                    <div className="my-1 border-t border-gray-700/50 pt-1 pb-0.5">
                                                        <span className="px-3 text-[10px] font-bold text-red-400/80 uppercase tracking-widest select-none">
                                                            Explicit
                                                        </span>
                                                    </div>
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setModel(mod);
                                                        setActiveMenu(null);
                                                        setMode('text');
                                                    }}
                                                    className={`w-full text-left px-3 py-2 text-xs hover:bg-violet-600/20 hover:text-violet-300 transition-colors ${model === mod
                                                        ? 'text-violet-400 bg-violet-600/10 font-medium'
                                                        : 'text-gray-300'
                                                        }`}
                                                >
                                                    {mod}
                                                </button>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="h-4 w-px bg-gray-600 mx-1"></div>

                        {/* 2. Text / Image Switch (Toggle) */}
                        <div className="flex bg-[#2A2A30] rounded-lg p-0.5 border border-gray-700/50">
                            <button
                                type="button"
                                onClick={() => {
                                    setMode('text')
                                }}
                                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${mode === 'text' ? 'bg-violet-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
                                    }`}
                            >
                                <BiText size={16} />
                                <span className="hidden sm:inline">Text</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => { setMode('image'), setModel(models[0]) }
                                }
                                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${mode === 'image' ? 'bg-violet-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
                                    }`}
                            >
                                <BiImage size={16} />
                                <span className="hidden sm:inline">Image</span>
                            </button>
                        </div>

                        {/* 3. Response Time Selector (Click to Open) */}
                        {mode === 'text' && model == 'openai' && <div className="relative" ref={timeMenuRef}>
                            <button
                                type="button"
                                onClick={() => toggleMenu('time')}
                                className={`flex items-center justify-between gap-1.5 px-2 py-1.5 text-xs text-gray-300 bg-[#2A2A30] hover:bg-[#36363E] rounded-lg transition-colors border ${activeMenu === 'time' ? 'border-violet-500 ring-1 ring-violet-500/50' : 'border-gray-700/50'}`}
                            >
                                <IoTimeOutline size={14} className={responseTime === 'high' ? 'text-red-400' : responseTime === 'minimal' ? 'text-green-400' : responseTime === 'low' ? 'text-yellow-400' : 'text-violet-400'} />
                                <span className="capitalize hidden sm:inline">{responseTime || 'Medium'}</span>
                                <MdKeyboardArrowDown className={`transition-transform duration-200 ${activeMenu === 'time' ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {activeMenu === 'time' && (
                                <div className="absolute bottom-full left-0 mb-2 w-32 bg-[#1B1B1F] border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                                    {['minimal', 'low', 'medium', 'high'].map((time, index) => (
                                        <>
                                            {index === 0 && (
                                                <div className="my-1 border-t border-gray-700/50 pt-2 pb-0.5">
                                                    <p className="px-3 text-[8px] font-bold text-center  text-green-400/80 uppercase tracking-widest select-none">
                                                        thinking level
                                                    </p>
                                                </div>
                                            )}
                                            <button
                                                key={time}
                                                type="button"
                                                onClick={() => {
                                                    setResponseTime(time);
                                                    setActiveMenu(null);
                                                }}
                                                className={`w-full text-left px-3 py-2 text-xs hover:bg-violet-600/20 hover:text-violet-300 transition-colors ${responseTime === time ? 'text-violet-400 bg-violet-600/10' : 'text-gray-300'
                                                    }`}
                                            >
                                                {time.charAt(0).toUpperCase() + time.slice(1)}
                                            </button>
                                        </>
                                    ))}
                                </div>
                            )}
                        </div>}
                    </div>

                    {/* RIGHT SIDE: Actions (Mic, Send) */}
                    <div className="flex items-center gap-2 ml-auto">

                        <button
                            type="button"
                            className="p-2 md:inline hidden rounded-full text-gray-400 hover:text-white hover:bg-[#36363E] transition-all"
                        >
                            <BiMicrophone className="text-xl" />
                        </button>
                        {/* Inside Input.jsx's return statement, replace the send button block with this: */}
                        <button
                            type="button"
                            disabled={!input && !isTyping} // Enable if typing (to stop) or if input has text (to send)
                            onClick={isTyping ? stopGeneration : handleSend}
                            className={`group flex items-center justify-center p-2  text-white transition-all shadow-lg 
        ${isTyping
                                    ? "bg-red-500 hover:bg-red-600 shadow-red-900/20 animate-pulse rounded-full"
                                    : "bg-violet-600 hover:bg-violet-700 rounded-lg shadow-violet-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                }`}
                        >
                            {isTyping ? (
                                <FaStop className="text-lg animate-pulse" />
                            ) : (
                                <IoSendSharp className="text-lg translate-x-0.5" />
                            )}
                        </button>
                    </div>
                </div>
            </form >
        </div >
    );
};

export default Input;