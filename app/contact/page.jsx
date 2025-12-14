"use client";
import React from 'react';
import Navbar from '@/Components/Navbar';
import { FaPaperPlane, FaDiscord, FaTwitter } from "react-icons/fa6";

export default function ContactPage() {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Thanks for reaching out! This is a demo form.");
    };

    return (
        <div className="min-h-screen bg-[#121212] text-white">
            <Navbar />
            <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 grid md:grid-cols-2 gap-16">

                {/* Left: Info */}
                <div>
                    <h1 className="text-4xl font-bold mb-6">Let's Chat.</h1>
                    <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                        Have a question about the API? Found a bug? Or just want to request a new feature?
                        Fill out the form or reach us on social media.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-[#1B1B1F] rounded-xl border border-gray-800">
                            <div className="bg-[#5865F2] w-12 h-12 rounded-full flex items-center justify-center text-xl text-white">
                                <FaDiscord />
                            </div>
                            <div>
                                <h3 className="font-bold">Discord Community</h3>
                                <p className="text-sm text-gray-400">Join 500+ AI enthusiasts</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-[#1B1B1F] rounded-xl border border-gray-800">
                            <div className="bg-[#1DA1F2] w-12 h-12 rounded-full flex items-center justify-center text-xl text-white">
                                <FaTwitter />
                            </div>
                            <div>
                                <h3 className="font-bold">Follow Updates</h3>
                                <p className="text-sm text-gray-400">@FusionX_AI</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Form */}
                <div className="bg-[#1B1B1F] p-8 rounded-3xl border border-gray-800 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                            <input type="text" className="w-full bg-[#2A2A2E] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all" placeholder="John Doe" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                            <input type="email" className="w-full bg-[#2A2A2E] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all" placeholder="john@example.com" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                            <textarea rows="4" className="w-full bg-[#2A2A2E] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all" placeholder="Tell us what's on your mind..."></textarea>
                        </div>

                        <button type="submit" className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2">
                            <FaPaperPlane /> Send Message
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}