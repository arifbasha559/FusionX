import React from 'react';
import Navbar from '@/Components/Navbar'; // Import Navbar
import Link from 'next/link';
import { FaRobot, FaBolt, FaImage, FaCode, FaShieldHalved, FaGlobe, FaBrain, FaEye, FaWind, FaTerminal, FaGamepad, FaLeaf, FaSkull, FaCube } from "react-icons/fa6";

export default function LandingPage() {
  const models = ["openai", "deepseek", "gemini", 'mistral', "qwen-coder", "roblox-rp", "bidara", "evil", "unity"];
  const getModelIcon = (modelName) => {
    if (modelName.includes('openai')) return <FaBrain />;      // OpenAI -> Brain
    if (modelName.includes('deepseek')) return <FaEye />;      // DeepSeek -> Eye
    if (modelName.includes('gemini')) return <FaGlobe />;      // Gemini -> Google/Globe
    if (modelName.includes('mistral')) return <FaWind />;      // Mistral -> Wind
    if (modelName.includes('qwen')) return <FaTerminal />;     // Qwen Coder -> Terminal
    if (modelName.includes('roblox')) return <FaGamepad />;    // Roblox -> Gamepad
    if (modelName.includes('bidara')) return <FaLeaf />;       // Bidara -> Leaf (Nature)
    if (modelName.includes('evil')) return <FaSkull />;        // Evil -> Skull
    if (modelName.includes('unity')) return <FaCube />;        // Unity -> Cube (3D)
    return <FaRobot />; // Default
  };
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="pt-32 pb-20 px-6 text-center max-w-5xl mx-auto min-h-screen flex flex-col justify-center items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-900/30 hover:bg-violet-900/60 transition-all border border-violet-700/50 text-violet-300 text-sm font-medium mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500 "></span>
          </span>
          v2.0 Now Available
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-linear-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
          The Future of AI <br /> is Open & Free.
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
          FusionX aggregates the world's best AI models into one clean interface.
          Access GPT-4, DeepSeek, Gemini, and Image generation tools without subscriptions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/chat" className="px-8 py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            Start Chatting
          </Link>
          <Link href="/about" className="px-8 py-4 bg-[#2A2A2E] text-white rounded-xl font-bold text-lg hover:bg-[#323236] transition-all border border-gray-700">
            View Features
          </Link>
        </div>
      </section>

      {/* 2. LIVE STATS / BRANDS (Visual Filler) */}
      {/* Infinite Scrolling Marquee */}
      <div className="border-y border-gray-800 bg-black/20 py-8 overflow-hidden select-none relative">
        {/* Left Fade Gradient */}
        <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-[#171719] to-transparent z-10" />
        {/* Right Fade Gradient */}
        <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-[#171719] to-transparent z-10" />

        <div className="flex w-max animate-marquee gap-12 md:gap-24 opacity-50  transition-all duration-500">
          {/* Duplicate list twice for seamless loop */}
          {[...models, ...models, ...models].map((mod, i) => (
            <span key={i} className="text-xl font-bold flex items-center gap-3 uppercase grayscale hover:grayscale-0 tracking-widest text-violet-400">
              <span className="text-violet-500 text-2xl">
                {getModelIcon(mod)}
              </span>
              {mod}
            </span>
          ))}
        </div>
      </div>

      {/* 3. FEATURE GRID */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Why use FusionX?</h2>
          <p className="text-gray-400">Everything you need to be productive, built into one wrapper.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <FaRobot />, title: "Model Aggregation", desc: "Don't limit yourself to one AI. Switch between GPT-4o, Gemini Flash, and Llama 3 instantly to compare results." },
            { icon: <FaImage />, title: "Visual Creation", desc: "Describe your imagination and let Flux or Stable Diffusion generate high-quality images in seconds." },
            { icon: <FaCode />, title: "Developer Friendly", desc: "Paste code snippets for debugging. Our specialized 'Coder' models help you fix bugs faster." },
            { icon: <FaShieldHalved />, title: "Privacy First", desc: "We don't store your data. Your chat history lives in your browser and is deleted when you clear your cache." },
            { icon: <FaBolt />, title: "Zero Latency", desc: "Powered by the Pollinations API, ensuring lightning-fast responses without the usual queue times." },
            { icon: <FaGlobe />, title: "No Accounts", desc: "Stop signing up for waitlists. Open the site and start typing immediately. No email required." },
          ].map((item, i) => (
            <div key={i} className="p-8 bg-[#1B1B1F] rounded-2xl border border-gray-800 hover:border-violet-600/50 transition-all hover:-translate-y-1 group">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-violet-400 text-2xl mb-6 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FAQ SECTION */}
      <section className="py-24 px-6 bg-[#171719]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Is FusionX really free?", a: "Yes. We use the Pollinations.ai public API which provides free access to these models for educational and creative use." },
              { q: "Do you save my chats?", a: "No. Your chats are stored in your browser's local storage (RAM) and are lost if you refresh, ensuring total privacy." },
              { q: "Can I generate NSFW images?", a: "We provide access to unfiltered models, but we encourage responsible usage. Check the model list for specific 'uncensored' tags." },
            ].map((faq, i) => (
              <details key={i} className="bg-[#212121] border border-gray-800 rounded-xl overflow-hidden group">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold hover:text-violet-400 transition-colors">
                  {faq.q}
                  <span className="transform group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-gray-800 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-gray-800 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} FusionX AI. Built with Next.js & Pollinations.</p>
      </footer>
    </div>
  );
}