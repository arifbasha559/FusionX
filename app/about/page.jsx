import React from 'react';
import Link from 'next/link';
import { FaServer, FaCodeBranch, FaUsers, FaArrowRightLong, FaDatabase } from "react-icons/fa6";
import Navbar from '@/Components/Navbar';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#171719] text-white">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-20 flex flex-col relative z-10 gap-10 ">

                <div className="">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Democratizing Intelligence</h1>
                    <p className="text-xl text-gray-400 leading-relaxed text-justify">
                        &emsp;&emsp; FusionX isn't just a chatbot. It's a bridge. A bridge that connects you to the world's most powerful AI models through a unified, fast, and privacy-conscious interface.
                    </p>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 ">
                    <div className="bg-[#212121] p-6 rounded-xl border border-gray-800">
                        <div className="text-3xl font-bold text-violet-400 mb-1">5+</div>
                        <div className="text-sm text-gray-400">AI Models</div>
                    </div>
                    <div className="bg-[#212121] p-6 rounded-xl border border-gray-800">
                        <div className="text-3xl font-bold text-blue-400 mb-1">Hybrid</div>
                        <div className="text-sm text-gray-400">Local & Cloud Storage</div>
                    </div>
                    <div className="bg-[#212121] p-6 rounded-xl border border-gray-800 col-span-2 md:col-span-1">
                        <div className="text-3xl font-bold text-green-400 mb-1">100%</div>
                        <div className="text-sm text-gray-400">Free & Open</div>
                    </div>
                </div>

                <div className="space-y-12">
                    {/* ARCHITECTURE SECTION */}
                    <section className='text-justify'>
                        <div className="flex items-center gap-3 mb-4 text-violet-400">
                            <FaServer className="text-2xl" />
                            <h2 className="text-2xl font-bold text-white">Hybrid Architecture</h2>
                        </div>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            &emsp;&emsp; FusionX operates on a unique hybrid model that puts you in control of your data. We utilize the <strong>Pollinations.ai API</strong> for model inference, ensuring fast.
                        </p>

                        <div className="grid md:grid-cols-2 gap-4 mt-6">
                            <div className="p-4 bg-[#2A2A2E] rounded-lg border border-gray-700">
                                <h3 className="font-bold text-white mb-2 flex items-center gap-2"><FaServer /> Guest Mode</h3>
                                <p className="text-sm text-gray-400">
                                    No sign-up required. Your chat history lives <strong>only in your browser's Local Storage</strong>. If you clear your cache, your chats are gone. Zero server retention.
                                </p>
                            </div>
                            <div className="p-4 bg-[#2A2A2E] rounded-lg border border-gray-700">
                                <h3 className="font-bold text-white mb-2 flex items-center gap-2"><FaDatabase /> Cloud Sync</h3>
                                <p className="text-sm text-gray-400">
                                    Sign in securely via Clerk. Your chats are encrypted and stored in our MongoDB database, allowing you to <strong>sync conversations across devices</strong> seamlessly.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* OPEN SOURCE SECTION */}
                    <section>
                        <div className="flex items-center gap-3 mb-4 text-violet-400">
                            <FaCodeBranch className="text-2xl" />
                            <h2 className="text-2xl font-bold text-white">Open Source</h2>
                        </div>
                        <p className="text-gray-300 text-justify leading-relaxed mb-6">
                            &emsp;&emsp;Transparency is key to trust in the age of AI. The entire source code for the FusionX frontend is available for audit on GitHub. We believe in building in public.
                        </p>
                        <a href="https://github.com/arifbasha559/FusionX" target="_blank" className="inline-flex items-center gap-2 text-white bg-[#2A2A2E] hover:bg-[#323236] px-5 py-3 rounded-lg font-medium transition-colors border border-gray-700">
                            View Source on GitHub
                        </a>
                    </section>

                    {/* TEAM SECTION */}
                    <section>
                        <div className="flex items-center gap-3 mb-4 text-violet-400">
                            <FaUsers className="text-2xl" />
                            <h2 className="text-2xl font-bold text-white">The Team</h2>
                        </div>
                       <p className="text-gray-300 text-justify leading-relaxed">
                            &emsp;&emsp;Built by a passionate group of developers who wanted a cleaner, faster way to use multiple AI models without switching between tabs and paying for multiple subscriptions.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}