"use client";
import React, { useEffect, useState } from 'react';
import Navbar from '@/Components/Navbar';
import Link from 'next/link';
import { useUser } from "@clerk/nextjs";
import { FaRobot, FaBolt, FaImage, FaShieldHalved, FaGlobe, FaBrain, FaEye, FaWind, FaTerminal, FaGamepad, FaLeaf, FaSkull, FaCube, FaCloud, FaDownload, FaWifi, FaCopy, FaTwitter, FaLinkedin, FaGithub, FaHeart } from "react-icons/fa6";
import { AiFillLike } from 'react-icons/ai';

export default function LandingPage() {
  const { isSignedIn, user } = useUser();
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  const models = ["openai", "mistral", "deepseek", "google", "llama", "Arcee", "Z.AI", "Nemotron", "dolphin"];

  const getModelIcon = (modelName) => {
    if (modelName.includes('openai')) return <FaBrain />;
    if (modelName.includes('stepfun')) return <FaWind />;
    if (modelName.includes('deepseek')) return <FaEye />;
    if (modelName.includes('llama')) return <FaCube />;
    if (modelName.includes('Seedream')) return <FaGlobe />;
    if (modelName.includes('Arcee')) return <FaRobot />;
    if (modelName.includes('Z.AI')) return <FaBolt />;
    if (modelName.includes('Nemotron')) return <FaBrain />;
    if (modelName.includes('dolphin')) return <FaTerminal />;
    return <FaRobot />;
  };

  // PWA Install Logic
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white relative overflow-hidden">
      <Navbar />

      {/* BACKGROUND GRID ANIMATION */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      {/* 1. HERO SECTION */}
      <section className="pt-32 pb-20 px-6 text-center select-none max-w-5xl mx-auto min-h-screen flex flex-col justify-center items-center relative z-10">

        {/* Version Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-900/30 hover:bg-violet-900/60 transition-all border border-violet-700/50 text-violet-300 text-sm font-medium mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="relative flex h-2 w-2 ">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500 "></span>
          </span>
          v2.0 is Coming Soon! Stay Tuned.
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
          The Future of AI <br /> is Open & Free.
        </h1>

        {/* Dynamic Subtext */}
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
          Choose from 9 powerful AI models—OpenAI, DeepSeek, Mistral, Llama, and more.
          Generate images with Flux, rate responses, and switch models mid-chat. <br />
          <span className="text-violet-400">
            {isSignedIn
              ? `Welcome back, ${user?.firstName || "User"}. Your chats are synced.`
              : "Sign in to save your conversations across all devices."}
          </span>
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/chat"
            className="px-8 py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] w-full sm:w-auto"
          >
            {isSignedIn ? "Resume Chatting" : "Start Chatting"}
          </Link>

          <Link
            href="/about"
            className="px-8 py-4 bg-[#2A2A2E] text-white rounded-xl font-bold text-lg hover:bg-[#323236] transition-all border border-gray-700 w-full sm:w-auto"
          >
            View Features
          </Link>

          {/* PWA Install Button (Only shows if installable) */}
          {deferredPrompt && (
            <button
              onClick={handleInstall}
              className="px-8 py-4 bg-violet-600 text-white rounded-xl font-bold text-lg hover:bg-violet-700 transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <FaDownload /> Install App
            </button>
          )}
        </div>
      </section>

      {/* 2. LIVE STATS / BRANDS (Marquee) */}
      <div className="hover:border-violet-600/50 border-y border-gray-800 bg-black/40 py-8 overflow-hidden select-none relative backdrop-blur-sm">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#121212] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#121212] to-transparent z-10" />

        <div className="flex w-max animate-marquee gap-12 md:gap-24 opacity-50 transition-all duration-500 hover:opacity-100 ">
          {[...models, ...models, ...models].map((mod, i) => (
            <span key={i} className="text-xl font-bold flex items-center gap-3 uppercase grayscale hover:grayscale-0 tracking-widest text-violet-400 transition-all">
              <span className="text-violet-500 text-2xl">
                {getModelIcon(mod)}
              </span>
              {mod}
            </span>
          ))}
        </div>
      </div>

      {/* 3. FEATURE GRID */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Why use FusionX?</h2>
          <p className="text-gray-400">Productivity tools built for the modern web.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <FaRobot />, title: "9 AI Models", desc: "Access OpenAI, DeepSeek, Mistral, Llama, Arcee, Google, Z.AI, Nemotron, and Dolphin. Switch instantly without losing context." },
            { icon: <FaImage />, title: "AI Image Generation", desc: "Toggle to Image mode and describe any concept. Flux generates stunning visuals instantly. Download with one click." },
            { icon: <FaCloud />, title: "Cloud & Local Sync", desc: "Sign in to sync chats securely to the cloud. Browse as guest? Your chats stay safely in local storage." },
            { icon: <FaCopy />, title: "One-Click Copy", desc: "Copy any AI response instantly with perfect formatting. Paste code, text, or entire conversations anywhere." },
            { icon: <FaBolt />, title: "Thinking Levels", desc: "When using OpenAI, pick minimal (fast), low, medium, or high thinking levels to match your needs." },
            { icon: <AiFillLike />, title: "Rate & Feedback", desc: "Thumbs up or down on responses. Your ratings help improve the quality of AI answers over time." },
          ].map((item, i) => (
            <div key={i} className="p-8 bg-[#1B1B1F]/80 backdrop-blur-md rounded-2xl border border-gray-800 hover:border-violet-600/50 transition-all hover:-translate-y-1 group">
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
      <section className="py-24 px-6 bg-[#171719] relative z-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Is FusionX really free?", a: "Yes. We use the OpenRouter.ai public API which provides free access to these models for educational and creative use." },
              { q: "Do you save my chats?", a: "It depends. If you are a Guest, chats are stored in your browser (LocalStorage). If you Sign In, chats are securely saved to our database." },
              { q: "Why should I switch models?", a: "Different models excel at different tasks. Use Qwen for coding, Gemini for logic, and Mistral for creative writing—all within the same chat interface." },
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
      <footer className="bg-muted/50 border-t py-12 text-muted-foreground">
        <div className="container mx-auto px-4">
          {/* Top Section: Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

            {/* Column 1: Brand & tagline */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">FusionX AI</h3>
              <p className="text-sm leading-relaxed">
                The Future of AI is Open & Free. Access 9 powerful models, generate images, and sync chats across devices...
              </p>
            </div>

            {/* Column 2: Product Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-primary transition-colors">Features</li>
                <li className="hover:text-primary transition-colors">Pricing</li>
                <li className="hover:text-primary transition-colors">Success Stories</li>
                <li className="hover:text-primary transition-colors">Career Blog</li>
              </ul>
            </div>

            {/* Column 3: Company & Legal */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Company</h4>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-primary transition-colors">About Us</li>
                <li className="hover:text-primary transition-colors">Contact Support</li>
                <li className="hover:text-primary transition-colors">Privacy Policy</li>
                <li className="hover:text-primary transition-colors">Terms of Service</li>
              </ul>
            </div>

            {/* Column 4: Socials & Newsletter (Optional) */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Connect with Us</h4>
              <div className="flex space-x-4">
                <Link href="https://x.com/arifbasha559" className="hover:text-foreground transition-colors">
                  <FaTwitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link href="https://www.linkedin.com/in/arifbasha559" className="hover:text-foreground transition-colors">
                  <FaLinkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
                <Link href="https://github.com/arifbasha559" className="hover:text-foreground transition-colors">
                  <FaGithub className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Section: Copyright */}
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} FusionX. All rights reserved.
              <span className="block sm:inline ml-1 mt-2 sm:mt-0">Made with <FaHeart className="inline-block ml-1 text-red-500" /> by Arif's Team </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}