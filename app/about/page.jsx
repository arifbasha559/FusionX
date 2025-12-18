import React from 'react';
import Link from 'next/link';
import { FaServer, FaCodeBranch, FaUsers, FaArrowRightLong } from "react-icons/fa6";
import Navbar from '@/Components/Navbar';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#171719] text-white">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-16">

                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Democratizing Intelligence</h1>
                    <p className="text-xl text-gray-400 leading-relaxed text-justify">
                        &emsp;&emsp; FusionX isn't just a chatbot. It's a statement. A statement that powerful AI tools should be accessible, fast, and privacy-focused for everyone, everywhere.
                    </p>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-16">
                    <div className="bg-[#212121] p-6 rounded-xl border border-gray-800">
                        <div className="text-3xl font-bold text-violet-400 mb-1">15+</div>
                        <div className="text-sm text-gray-400">AI Models</div>
                    </div>
                    <div className="bg-[#212121] p-6 rounded-xl border border-gray-800">
                        <div className="text-3xl font-bold text-blue-400 mb-1">0ms</div>
                        <div className="text-sm text-gray-400">Data Retention</div>
                    </div>
                    <div className="bg-[#212121] p-6 rounded-xl border border-gray-800 col-span-2 md:col-span-1">
                        <div className="text-3xl font-bold text-green-400 mb-1">100%</div>
                        <div className="text-sm text-gray-400">Free & Open</div>
                    </div>
                </div>

                <div className="space-y-12">
                    <section className='text-justify'>
                        <div className="flex items-center gap-3 mb-4 text-violet-400">
                            <FaServer className="text-2xl" />
                            <h2 className="text-2xl font-bold text-white">The Architecture</h2>
                        </div>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            &emsp;&emsp;  FusionX operates as a lightweight, high-performance client wrapper. When you type a message, your browser communicates directly with the Pollinations.ai API network.
                        </p>
                        <p className="text-gray-300 leading-relaxed">
                            &emsp;&emsp; This architecture ensures that <strong>we do not see your messages</strong>. There is no "FusionX Database" storing your conversations. The data flows from you <FaArrowRightLong className='inline' /> API <FaArrowRightLong className='inline' /> you.
                        </p>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-4 text-violet-400">
                            <FaCodeBranch className="text-2xl" />
                            <h2 className="text-2xl font-bold text-white">Open Source</h2>
                        </div>
                        <p className="text-gray-300 leading-relaxed mb-6">
                            &emsp;&emsp;Transparency is key to trust in the age of AI. The entire source code for the FusionX frontend is available for audit.
                        </p>
                        <a href="https://github.com/arifbasha559/FusionX" target="_blank" className="inline-flex items-center gap-2 text-white bg-[#2A2A2E] hover:bg-[#323236] px-5 py-3 rounded-lg font-medium transition-colors border border-gray-700">
                            View Source on GitHub
                        </a>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-4 text-violet-400">
                            <FaUsers className="text-2xl" />
                            <h2 className="text-2xl font-bold text-white">The Team</h2>
                        </div>
                        <p className="text-gray-300 leading-relaxed">
                            &emsp;&emsp;Built by a passionate group of developers who wanted a cleaner, faster way to use multiple AI models without switching between tabs and paying for multiple subscriptions.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}