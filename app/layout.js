import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import NoInternet from "@/Components/NoInternet";
import Script from "next/script";

export const metadata = {
  title: 'FusionX - Free AI Chatbot with Multi-Model Support',
  description: 'Generate text and images for free using FusionX. Supports OpenAI, DeepSeek, and Stable Diffusion models without login.',
  keywords: ['AI Chatbot', 'Free GPT-4', 'DeepSeek', 'Image Generator', 'AI Writing Tool'],
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        theme: dark
      }}>

      <html lang="en" data-gsap-chrome-extension="not-found"
                   gsap-chrome-extension="not-found">
      <body
        cz-shortcut-listen="true">
          <Script src="https://js.puter.com/v2/" strategy="beforeInteractive" />
        <NoInternet />
        {children}
      </body>
    </html>
    </ClerkProvider >
  );
}
