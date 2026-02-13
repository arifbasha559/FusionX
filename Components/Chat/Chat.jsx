"use client";
import React, { useEffect, useRef, useState, useMemo, memo } from "react";
import Input from "./Input";
import { FaRegCopy, FaRobot, FaUser, FaArrowDown, FaStop } from "react-icons/fa6";
import fetchApi, { titleMaker } from "../../api/fetchapi";
import ReactMarkdown from "react-markdown";
import { HiClipboardCheck, HiOutlineClipboardCopy } from "react-icons/hi";
import { FaCopy } from "react-icons/fa";
import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { BiImage } from "react-icons/bi";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { UserButton, useUser } from "@clerk/nextjs";
import ChatLoader from '@/Components/Chat/ChatLoader'; // Check your path
import remarkGfm from "remark-gfm";

// --- 1. New Loading Bubble Component ---
const LoadingBubble = () => (
    <div className="flex space-x-1 items-center h-6">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
    </div>
);

// ... ImageRenderer & CodeBlock ...
const ImageRenderer = ({ src, alt }) => {
    const [isLoading, setIsLoading] = useState(true);
    if (!src || src === "") return null;

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
        <span className="relative block my-3 rounded-lg overflow-hidden border border-gray-700 bg-black/20 w-fit min-w-[100px] min-h-[100px]">
            {isLoading && (
                <span className="flex flex-col items-center justify-center size-40  bg-[#2A2A2E] animate-pulse  z-10">
                    <BiImage className="text-3xl text-gray-500 mb-2" />
                    <span className="text-xs text-white font-medium">Generating Image...</span>
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
                onLoad={() => setIsLoading(false)}
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

// --- 2. Enhanced MessageItem ---
const MessageItem = memo(({ msg, index, markdownComponents, copyToClipboard, copiedIndex, setCopiedIndex }) => {
    const isThinking = msg.content === "Thinking 🤖...";
    const [like, setLike] = useState(null);
    const { isSignedIn, user } = useUser();

    return (
        <div className={`flex gap-3 items-start group/message ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
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
                        {console.log(msg)}
                        {msg.model} {msg.mode === 'image' && '• Image'}
                    </span>
                )}

                <div className={`px-4 py-2 items-center rounded-2xl max-w-full  shadow-sm text-sm w-fit ${msg.role === "user" ? "bg-violet-600 text-white rounded-tr-none" : "bg-[#2E2E33] text-gray-100 rounded-tl-none"}`}>
                    {isThinking ? (
                        <LoadingBubble />
                    ) : (
                        (msg.content.endsWith("▋")) ? (
                            <div className="whitespace-pre-wrap">{msg.content.slice(0, -1)}<span className="animate-pulse">▋</span></div>
                        ) : (
                            msg.role === "system" ?
                                <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]} urlTransform={(value) => value}>
                                    {msg.content?.trim()}
                                    
                                </ReactMarkdown>
                                : msg.content
                        )
                    )}
                </div>

                {index !== 0 && !isThinking && (
                    <div className={`flex gap-3 group-hover/message:opacity-100 group-focus:opacity-100  opacity-0  mt-1 px-1 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        {!msg.content.includes("![Generated Image]") && <button onClick={() => { setCopiedIndex(index); copyToClipboard(msg.content); setTimeout(() => setCopiedIndex(null), 1000); }} className="text-gray-500 hover:text-white transition-colors text-sm" title="Copy message">
                            {copiedIndex === index ? <FaCopy /> : <FaRegCopy />}
                        </button>}
                        {msg.role !== "user" && (
                            <>
                                <button onClick={() => setLike((prev) => prev === null ? true : prev === true ? null : true)} className="text-gray-500 hover:text-white transition-colors text-lg">{like === true ? <AiFillLike /> : <AiOutlineLike />}</button>
                                <button onClick={() => setLike((prev) => prev === null ? false : prev === false ? null : false)} className="text-gray-500 hover:text-white transition-colors text-lg">{like === false ? <AiFillDislike /> : <AiOutlineDislike />}</button>

                            </>
                        )}
                    </div>
                )}
            </div>
            {msg.role === "user" && (
                <div className="bg-[#2A2A2E] p-2 flex justify-center rounded-full rounded-tl-none ">
                    {isSignedIn && user ? (
                        <UserButton appearance={{ elements: { userButtonAvatarBox: "hidden", userButtonPopoverFooter: "hidden" } }} />)
                        : <FaUser className="text-white" />
                    }
                </div>
            )}
        </div>
    );
});
MessageItem.displayName = "MessageItem";

// --- 3. Enhanced Type Effect ---

const sanitizeMessages = (msgs) => {
    if (!msgs) return [];

    return msgs.map((msg) => {
        // Only check AI/System messages
        if (msg.role === "system") {
            // 1. If it's stuck on the Loading Bubble
            if (msg.content === "Thinking 🤖...") {
                return {
                    ...msg,
                    content: "Generation stopped (Reloaded while thinking)."
                };
            }
            // 2. If it's stuck halfway through typing (has the cursor)
            if (typeof msg.content === "string" && msg.content.endsWith("▋")) {
                return {
                    ...msg,
                    content: msg.content.slice(0, -1) // Remove the cursor
                };
            }
        }
        return msg;
    });
};
const Chat = () => {
    const params = useParams(); // 2. Get parameters
    const router = useRouter();
    const routeId = params?.id;
    const models = ["openai", "stepfun", "deepseek", "llama", "Arcee", "Z.AI", "Nemotron"];
    const [input, setInput] = useState("");
    const [model, setModel] = useState(models[0]);
    const [messages, setMessages] = useState([
        { role: "system", content: "Hey there 👋! How can I help you today?", model: models[0] },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [mode, setMode] = useState("text");
    const [responseTime, setResponseTime] = useState('medium');
    const [chatTitle, setChatTitle] = useState("");
    const [showScrollButton, setShowScrollButton] = useState(false);
    const chatEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    const typingIntervalRef = useRef(null);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [chatId, setChatId] = useState(() => {
        return routeId || nanoid();
    });
    const { user, isSignedIn } = useUser();

    const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // ... inside Chat.jsx ...

    useEffect(() => {
        const loadChatData = async () => {
            setIsLoadingHistory(true);

            if (routeId) {
                // ... setup chatId ...
                let dataLoaded = false;

                // --- OPTION A: DB Load ---
                if (isSignedIn) {
                    try {
                        const res = await fetch(`/api/chat/${routeId}`);
                        if (res.ok) {
                            const data = await res.json();
                            if (data && data.messages) {
                                // ... existing logic ...
                                setMessages(sanitizeMessages(data.messages));
                                setModel(data.model || models[0]);

                                // 2. SET TITLE FROM DB
                                setChatTitle(data.title || "");
                                dataLoaded = true;
                            }
                        }
                    } catch (error) { console.error("Failed to load from DB:", error); }
                }

                // --- OPTION B: LocalStorage Load ---
                if (!dataLoaded) {
                    const savedChats = localStorage.getItem("chats");
                    if (savedChats) {
                        const parsedChats = JSON.parse(savedChats);
                        const currentChat = parsedChats.find(c => c.id === routeId);
                        if (currentChat) {
                            // ... existing logic ...
                            setMessages(sanitizeMessages(currentChat.messages));
                            setModel(currentChat.model || models[0]);

                            // 3. SET TITLE FROM LOCAL STORAGE
                            setChatTitle(currentChat.title || "");
                        }
                    }
                }
            } else {
                // New Chat
                setChatId(nanoid());
                setMessages([{ role: "system", content: "Hey there 👋! How can I help you today?", model: models[0] }]);

                // 4. RESET TITLE FOR NEW CHAT
                setChatTitle("");
            }
            setIsLoadingHistory(false);
        };
        loadChatData();
    }, [routeId, isSignedIn]);


    useEffect(() => {
        if (messages.length <= 1) return;

        const timeoutId = setTimeout(async () => {
            try {
                const firstUserMsg = messages.find(m => m.role === 'user');

                // 5. USE STATE INSTEAD OF RECALCULATING
                let finalTitle = chatTitle;

                // 6. ONLY GENERATE IF TITLE IS MISSING OR DEFAULT
                if ((!finalTitle || finalTitle === "New Chat") && firstUserMsg) {
                    try {
                        console.log("Generating Title..."); // Debugging to prove it only runs once
                        finalTitle = await titleMaker(firstUserMsg.content);
                    } catch (err) {
                        finalTitle = firstUserMsg.content.slice(0, 30);
                    }
                    // Update state so it doesn't run again on next render
                    setChatTitle(finalTitle);
                }

                // Fallback if titleMaker failed or no user msg yet
                if (!finalTitle) finalTitle = "New Chat";

                const chatData = {
                    chatId: chatId,
                    title: finalTitle, // Use the variable, not the function call
                    messages: messages,
                    model: model,
                    lastUpdated: new Date().toISOString()
                };

                // ... Rest of your saving logic (DB/LocalStorage) remains exactly the same ...

                if (isSignedIn) {
                    const dbPayload = { ...chatData, userId: user.id };
                    await fetch('/api/chat/save', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(dbPayload),
                    });
                    window.dispatchEvent(new Event("chatListUpdated"));
                } else {
                    const savedChats = localStorage.getItem("chats");
                    const chats = savedChats ? JSON.parse(savedChats) : [];
                    const existingIndex = chats.findIndex((c) => c.id === chatId);
                    const localData = { id: chatId, ...chatData };

                    if (existingIndex !== -1) {
                        chats[existingIndex] = localData;
                    } else {
                        chats.unshift(localData);
                    }
                    localStorage.setItem("chats", JSON.stringify(chats));
                    window.dispatchEvent(new Event("chatListUpdated"));
                }

                if (!routeId) {
                    window.history.replaceState(null, '', `/chat/${chatId}`);
                }

            } catch (error) {
                console.error("Failed to save chat history:", error);
            }
        }, 1000);

        return () => clearTimeout(timeoutId);
        // 7. ADD chatTitle TO DEPENDENCY ARRAY
    }, [messages, chatId, model, isSignedIn, user, chatTitle]); // Added user dependencies

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



    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        const currentModel = model;
        const currentMode = mode;
        const userMessage = { role: "user", content: input.trim() };

        // 1. Add User Message
        const newHistory = [...messages, userMessage];
        setMessages(newHistory);
        setInput("");
        setTimeout(scrollToBottom, 50);
        setIsTyping(true);

        // 2. Add Placeholder for AI Response (Empty at first)
        setMessages((prev) => [
            ...prev,
            { role: "system", content: "", model: currentModel, mode: currentMode }
        ]);

        try {
            // 3. Call the API (Returns a Stream now!)
            const cleanHistory = newHistory.map(({ role, content }) => ({ role, content }));
            const stream = await fetchApi(input, currentModel, currentMode, responseTime, cleanHistory);

            let fullContent = "";

            // 4. Loop through the stream as chunks arrive
            for await (const chunk of stream) {
                // Check if user clicked "Stop"
                if (!typingIntervalRef.current && fullContent.length > 0) break;

                // Allow stopping by setting a flag (optional, see stop function below)
                typingIntervalRef.current = true;

                fullContent += chunk;

                // Update the LAST message with new content + Cursor
                setMessages((prev) => {
                    const updated = [...prev];
                    const lastMsgIndex = updated.length - 1;
                    updated[lastMsgIndex] = {
                        ...updated[lastMsgIndex],
                        content: fullContent + "▋" // Add cursor
                    };
                    return updated;
                });

                // Auto-scroll only if near bottom
                if (chatContainerRef.current) {
                    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
                    if (scrollHeight - scrollTop - clientHeight < 150) {
                        scrollToBottom();
                    }
                }
            }

            // 5. Stream Finished: Remove Cursor
            setMessages((prev) => {
                const updated = [...prev];
                const lastMsgIndex = updated.length - 1;
                updated[lastMsgIndex] = {
                    ...updated[lastMsgIndex],
                    content: fullContent // Cursor removed
                };
                return updated;
            });

        } catch (err) {
            console.error("Stream Error:", err);
            setMessages((prev) => [
                ...prev.slice(0, -1),
                { role: "system", content: "⚠️ Failed to fetch response.", model: "error" }
            ]);
        } finally {
            setIsTyping(false);
            typingIntervalRef.current = null; // Reset stop flag
        }
    };

    // 3. UPDATE the stopGeneration function
    const stopGeneration = () => {
        // We use this ref as a "flag" to break the loop above
        typingIntervalRef.current = false;
        setIsTyping(false);

        // Remove cursor immediately
        setMessages((prev) => {
            const updated = [...prev];
            const lastMsg = updated[updated.length - 1];
            if (lastMsg.role === 'system' && lastMsg.content.endsWith("▋")) {
                updated[updated.length - 1] = {
                    ...lastMsg,
                    content: lastMsg.content.slice(0, -1)
                };
            }
            return updated;
        });
    };
    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (isTyping) return;
            handleSend();
        }
    };

    const copyToClipboard = async (text) => {
        // 1. Try the modern API first (if available and secure)
        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch (err) {
                console.error("Modern copy failed:", err);
                // Don't return false yet, try the fallback below
            }
        }

        // 2. Fallback method for HTTP or older browsers
        try {
            const textArea = document.createElement("textarea");
            textArea.value = text;

            // Ensure the textarea is not visible but part of the DOM
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            textArea.style.top = "0";
            document.body.appendChild(textArea);

            textArea.focus();
            textArea.select();

            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);

            return successful;
        } catch (err) {
            console.error("Fallback copy failed:", err);
            return false;
        }
    };

    const markdownComponents = useMemo(() => ({
        img: ImageRenderer,
        h1: (props) => <h1 className="text-xl font-bold text-violet-300 mt-6 mb-3" {...props} />,
        h2: (props) => <h2 className="text-lg font-semibold text-violet-300 mt-5 mb-2" {...props} />,
        h3: (props) => <h3 className="text-md font-semibold text-violet-200 mt-4 mb-2" {...props} />,
        p: (props) => <p className="leading-relaxed text-gray-300 my-1" {...props} />,
        ul: (props) => <ul className="list-disc list-inside ml-2 mb-4 space-y-1 text-gray-300" {...props} />,
        ol: (props) => <ol className="list-decimal list-inside ml-2 mb-4 text-gray-300" {...props} />,
        a: (props) => <a className="text-blue-400 hover:text-blue-300 hover:underline transition-colors" target="_blank" rel="noreferrer" {...props} />,
        code: ({ inline, children, ...props }) => inline
            ? <code className="bg-gray-800/80 rounded px-1.5 py-0.5 text-xs font-mono text-violet-200 border border-gray-700/50" {...props}>{children}</code>
            : <CodeBlock>{children}</CodeBlock>,

        // --- TABLE UPGRADES START HERE ---
         table: (props) => <div className="overflow-x-auto my-3"><table className="min-w-full border border-gray-700 text-sm" {...props} /></div>,

        thead: (props) => <thead className="bg-gray-800" {...props} />,

        th: (props) => <th className="px-3 py-2 text-left overflow-auto font-semibold text-gray-200 border-b border-gray-700" {...props} />,

        td: (props) => <td className="px-3 py-2 border-b border-gray-700 text-gray-300" {...props} />,
    }), []);

    return (
        <div className="flex flex-col relative  md:h-screen h-[calc(100dvh-40px)] max-w-full sm:max-w-xl md:max-w-3xl mx-auto">
            <div className="absolute top-0 left-0 h-10 w-full   bg-linear-to-b from-[#1B1B1F] via-[#1B1B1F] to-transparent z-10" />

            <div
                ref={chatContainerRef}
                onScroll={handleScroll}
                className="flex-1 px-4 pt-12 space-y-6  relative  overflow-y-auto scrollbar [&::-webkit-scrollbar-button]:hidden"
            // style={{ scrollbarColor: '#ffffff15 #2A2A3015', scrollbarWidth: 'thin' }}
            >
                {isLoadingHistory ? (<ChatLoader />
                ) : (
                    messages.map((msg, i) => (
                        <MessageItem
                            key={i}
                            index={i}
                            msg={msg}
                            markdownComponents={markdownComponents}

                            copyToClipboard={copyToClipboard}
                            copiedIndex={copiedIndex}
                            setCopiedIndex={setCopiedIndex}
                        />
                    )))}

                <div ref={chatEndRef} />
                <div className="sticky bottom-0 left-0 h-20 w-full   bg-linear-to-t from-[#1B1B1F] to-transparent z-0" />
            </div>
            {showScrollButton && (
                <button onClick={scrollToBottom} className="absolute bottom-36 animate-bounce left-1/2 -translate-x-1/2 bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full shadow-lg border border-gray-700 transition-all duration-200 z-50 animate-bounce-slow" title="Scroll to bottom">
                    <FaArrowDown />
                </button>
            )}
            <div className=" w-full">

                <div className="sticky w-full bottom-0 z-9999 bg-[#1B1B1F] pb-4 px-4 pt-2 border-t border-gray-800">
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
        </div>
    );
};

export default Chat;

