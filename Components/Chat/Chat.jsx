import React, { useEffect, useRef, useState, useMemo, memo } from "react";
import Input from "./Input";
import { FaRegCopy, FaRobot, FaUser, FaArrowDown, FaStop } from "react-icons/fa6"; // Added FaStop
import fetchApi from "../../api/fetchapi";
import ReactMarkdown from "react-markdown";
import { HiClipboardCheck, HiOutlineClipboardCopy } from "react-icons/hi";
import { FaCopy } from "react-icons/fa";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { BiImage } from "react-icons/bi";
import Image from "next/image";

// --- 1. New Loading Bubble Component ---
const LoadingBubble = () => (
    <div className="flex space-x-1 items-center h-6">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
    </div>
);

// ... ImageRenderer & CodeBlock remain the same (omitted for brevity) ...
// (Assume ImageRenderer and CodeBlock are defined here as before)
const ImageRenderer = ({ src, alt }) => {
    const [isLoading, setIsLoading] = useState(true);
    const handleDownload = async (e) => {
        e.stopPropagation();
        if (isLoading) return;
        try {
            const response = await fetch(src);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `ai-generated-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
            window.open(src, "_blank");
        }
    };

    return (
        <span className="relative block my-3 rounded-lg overflow-hidden border border-gray-700 bg-black/20 w-fit min-h-[100px]">
            {isLoading && (
                <span className="flex flex-col items-center justify-center h-48 w-64 bg-[#2A2A2E] animate-pulse absolute top-0 left-0 z-10">
                    <BiImage className="text-3xl text-gray-500 mb-2" />
                    <span className="text-xs text-gray-500 font-medium">Generating Image...</span>
                </span>
            )}
            <Image
                src={src}
                alt={alt || "AI Generated Image"}
                width={0}
                height={0}
                sizes="100vw"
                unoptimized
                style={{ width: 'auto', height: 'auto' }}
                className={`transition-opacity duration-500 ease-in-out ${isLoading ? "opacity-0" : "opacity-100"} max-h-64 object-contain rounded-lg cursor-pointer hover:opacity-90`}
                onLoadingComplete={() => setIsLoading(false)}
                onClick={handleDownload}
                title="Click to download"
            />
        </span>
    );
};

const CodeBlock = ({ children }) => {
    const [isCopied, setIsCopied] = useState(false);
    const codeText = Array.isArray(children)
        ? children.map((c) => (typeof c === "string" ? c : "")).join("")
        : typeof children === "string" ? children : "";

    const handleCopy = async () => {
        try { await navigator.clipboard.writeText(codeText); setIsCopied(true); setTimeout(() => setIsCopied(false), 2000); } catch (err) { }
    };

    return (
        <div className="relative my-4 bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
            <div className="flex items-center justify-between px-3 py-2 bg-gray-800/50 border-b border-gray-700/50">
                <span className="text-xs text-gray-400 font-medium select-none">Code</span>
                <button onClick={handleCopy} className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors" title={isCopied ? "Copied!" : "Copy code"}>
                    {isCopied ? <HiClipboardCheck className="text-green-400 h-4 w-4" /> : <HiOutlineClipboardCopy className="h-4 w-4" />}
                    <span className="text-xs">{isCopied ? "Copied!" : "Copy"}</span>
                </button>
            </div>
            <pre className="p-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                <code className="font-mono text-sm leading-relaxed whitespace-pre-wrap text-gray-200">{codeText}</code>
            </pre>
        </div>
    );
};

// --- 2. Enhanced MessageItem (Handles Loading State) ---
const MessageItem = memo(({ msg, index, markdownComponents, copyToClipboard, copiedIndex, setCopiedIndex }) => {
    // Check if this message is the "Thinking..." placeholder
    const isThinking = msg.content === "Thinking 🤖...";

    return (
        <div className={`flex gap-3 items-start ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "system" && (
                <div className="flex flex-col items-center gap-1">
                    <div title={msg.model} className="bg-[#383840] mt-5 p-2 rounded-full rounded-tr-none shadow-md">
                        <FaRobot className="text-white" />
                    </div>
                </div>
            )}
            <div className={`flex flex-col max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                {msg.role === "system" && msg.model && (
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 mb-1 ml-1 font-semibold">
                        {msg.model} {msg.mode === 'image' && '• Image'}
                    </span>
                )}

                <div className={`px-4 py-2 rounded-2xl max-w-full shadow-sm text-sm w-fit ${msg.role === "user" ? "bg-violet-600 text-white rounded-tr-none" : "bg-[#2E2E33] text-gray-100 rounded-tl-none"}`}>

                    {/* SHOW LOADING BUBBLE OR CONTENT */}
                    {isThinking ? (
                        <LoadingBubble />
                    ) : (
                        (msg.content.endsWith("▋")) ? (
                            <div className="whitespace-pre-wrap">{msg.content.slice(0, -1)}<span className="animate-pulse">▋</span></div>
                        ) : (
                            msg.role === "system" ?
                                <ReactMarkdown components={markdownComponents}>
                                    {msg.content}
                                </ReactMarkdown>
                                : msg.content
                        )
                    )}
                </div>

                {index !== 0 && !isThinking && (
                    <div className={`flex gap-3 mt-1 px-1 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <button onClick={() => { setCopiedIndex(index); copyToClipboard(msg.content); setTimeout(() => setCopiedIndex(null), 1000); }} className="text-gray-500 hover:text-white transition-colors text-sm" title="Copy message">
                            {copiedIndex === index ? <FaCopy /> : <FaRegCopy />}
                        </button>
                        {msg.role !== "user" && (
                            <>
                                <button className="text-gray-500 hover:text-white transition-colors text-lg"><AiOutlineLike /></button>
                                <button className="text-gray-500 hover:text-white transition-colors text-lg"><AiOutlineDislike /></button>
                            </>
                        )}
                    </div>
                )}
            </div>
            {msg.role === "user" && (
                <div className="bg-[#2A2A2E] p-2 rounded-full rounded-tl-none mt-1"><FaUser className="text-white" /></div>
            )}
        </div>
    );
});
MessageItem.displayName = "MessageItem";
// --- 3. Enhanced Type Effect (Uses Ref for Cleanup) ---
function typeEffect(text, setMessages, delay = 10, setIsTyping, intervalRef) {
    let i = 0;
    // Clear any existing interval first
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
        setMessages((prev) => {
            const lastIndex = prev.length - 1;
            const lastMsg = prev[lastIndex];
            const isTyping = i < text?.length;
            const displayText = text?.slice(0, i) + (isTyping ? "▋" : "");

            if (lastMsg.role === "system") {
                const updated = [...prev];
                updated[lastIndex] = { ...lastMsg, content: displayText };
                return updated;
            } else {
                return [...prev, { role: "system", content: displayText }];
            }
        });

        i++;

        if (i > text?.length) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setIsTyping(false);
        }
    }, delay);
}

const Chat = () => {
    const models = ["openai", "deepseek", "gemini", 'mistral', "qwen-coder", "roblox-rp", "bidara", "evil", "unity"];
    const [input, setInput] = useState("");
    const [model, setModel] = useState(models[0]);
    const [messages, setMessages] = useState([
        { role: "system", content: "Hey there 👋! How can I help you today?", model: models[0] },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [mode, setMode] = useState("text");
    const [responseTime, setResponseTime] = useState('medium');

    const [showScrollButton, setShowScrollButton] = useState(false);
    const chatEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    // NEW: Ref to store the typing interval ID
    const typingIntervalRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
            if (isNearBottom) chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleScroll = () => {
        if (chatContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
            setShowScrollButton((scrollHeight - scrollTop - clientHeight) > 200);
        }
    };

    const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

    // --- 4. Stop Generation Function ---
    const stopGeneration = () => {
        if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current); // Stop the timer
            typingIntervalRef.current = null;
        }
        setIsTyping(false);

        // Remove the cursor from the last message
        setMessages(prev => {
            const lastMsg = prev[prev.length - 1];
            if (lastMsg.role === 'system' && lastMsg.content.endsWith("▋")) {
                const updated = [...prev];
                updated[updated.length - 1] = {
                    ...lastMsg,
                    content: lastMsg.content.slice(0, -1) // Remove cursor
                };
                return updated;
            }
            return prev;
        });
    };

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        const currentModel = model;
        const currentMode = mode;
        const userMessage = { role: "user", content: input.trim() };

        const newHistory = [...messages, userMessage];
        setMessages(newHistory);
        setInput("");
        setTimeout(scrollToBottom, 50);
        setIsTyping(true); // Start Loading State

        // Add Placeholder
        setMessages((prev) => [...prev, { role: "system", content: "Thinking 🤖...", model: currentModel, mode: currentMode }]);

        try {
            const cleanHistory = newHistory.map(({ role, content }) => ({ role, content }));
            const aiResponse = await fetchApi(input, currentModel, currentMode, responseTime, cleanHistory);

            // Pass the ref to typeEffect
            typeEffect(aiResponse, setMessages, 15, setIsTyping, typingIntervalRef);
        } catch (err) {
            setMessages((prev) => [...prev.slice(0, -1), { role: "system", content: "⚠️ Failed to fetch response.", model: "error" }]);
            setIsTyping(false);
        }
    };
    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();

            // If AI is typing, ignore the Enter key completely
            if (isTyping) {
                return;
            }

            // Otherwise, send the message
            handleSend();
        }
    };
    const [copiedIndex, setCopiedIndex] = useState(null);
    const copyToClipboard = async (text) => {
        try { await navigator.clipboard.writeText(text); return true; } catch (err) { return false; }
    };

    const markdownComponents = useMemo(() => ({
        img: ImageRenderer,
        h1: (props) => <h1 className="text-xl font-bold text-violet-300 mt-3 mb-2" {...props} />,
        h2: (props) => <h2 className="text-lg font-semibold text-violet-300 mt-3 mb-1" {...props} />,
        h3: (props) => <h3 className="text-md font-semibold text-violet-200 my-2" {...props} />,
        p: (props) => <p className="leading-relaxed mb-1" {...props} />,
        ul: (props) => <ul className="list-disc list-inside ml-2 mb-2 space-y-1" {...props} />,
        ol: (props) => <ol className="list-decimal list-inside ml-2 mb-2" {...props} />,
        a: (props) => <a className="text-blue-400 hover:underline" target="_blank" rel="noreferrer" {...props} />,
        code: ({ inline, children, ...props }) => inline ? <code className="bg-gray-800 rounded px-1.5 py-0.5 text-xs font-mono text-violet-200" {...props}>{children}</code> : <CodeBlock>{children}</CodeBlock>,
        table: (props) => <div className="overflow-x-auto my-3"><table className="min-w-full border border-gray-700 text-sm" {...props} /></div>,
        thead: (props) => <thead className="bg-gray-800" {...props} />,
        th: (props) => <th className="px-3 py-2 text-left font-semibold text-gray-200 border-b border-gray-700" {...props} />,
        td: (props) => <td className="px-3 py-2 border-b border-gray-700 text-gray-300" {...props} />,
    }), []);

    return (
        <div className="flex flex-col relative h-full max-w-11/12 sm:max-w-xl md:max-w-3xl mx-auto">
            <div
                ref={chatContainerRef}
                onScroll={handleScroll}
                className="flex-1 p-4 space-y-6 relative overflow-y-auto scrollbar [&::-webkit-scrollbar-button]:hidden"
                style={{ scrollbarColor: '#ffffff55 #2A2A3025', scrollbarWidth: 'thin' }}
            >
                {messages.map((msg, i) => (
                    <MessageItem
                        key={i}
                        index={i}
                        msg={msg}
                        markdownComponents={markdownComponents}
                        copyToClipboard={copyToClipboard}
                        copiedIndex={copiedIndex}
                        setCopiedIndex={setCopiedIndex}
                    />
                ))}

                {showScrollButton && (
                    <button onClick={scrollToBottom} className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full shadow-lg border border-gray-700 transition-all duration-200 z-50 animate-bounce-slow" title="Scroll to bottom">
                        <FaArrowDown />
                    </button>
                )}
                <div ref={chatEndRef} />
            </div>

            <div className="sticky bottom-0 bg-[#1B1B1F] pb-4 px-4 pt-2 border-t border-gray-800">
                {/* 5. Pass isTyping and stopGeneration to Input */}
                <Input
                    input={input}
                    setInput={setInput}
                    handleSend={handleSend}
                    handleKeyPress={handleKeyPress}
                    model={model}
                    models={models}
                    setModel={setModel}
                    mode={mode}
                    setMode={setMode}
                    responseTime={responseTime}
                    setResponseTime={setResponseTime}
                    isTyping={isTyping}
                    stopGeneration={stopGeneration}
                />
            </div>
        </div>
    );
};

export default Chat;