import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "../components/layout/Navbar";
import { LayoutWrapper } from "../components/layout/LayoutWrapper";
import { AmbientStorm } from "../components/layout/AmbientStorm";
import { PWARegister } from "../components/PWARegister";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ThunderStorm — Portfolio-Grade Algorithm Visualizer",
  description: "An interactive, premium DSA visualizer with live performance metrics, synchronized multi-language code panels, and elastic GSAP animations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-[#0a0a0a] text-[#f0f0f0] font-sans">
        <PWARegister />
        <AmbientStorm />
        <Navbar />
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
