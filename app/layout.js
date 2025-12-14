import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const metadata = {
  title: 'FusionX - Free AI Chatbot with Multi-Model Support',
  description: 'Generate text and images for free using FusionX. Supports OpenAI, DeepSeek, and Stable Diffusion models without login.',
  keywords: ['AI Chatbot', 'Free GPT-4', 'DeepSeek', 'Image Generator', 'AI Writing Tool'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        cz-shortcut-listen="true">
        {children}
      </body>
    </html>
  );
}
