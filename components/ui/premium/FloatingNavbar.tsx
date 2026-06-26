"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, Sun, Moon, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/context/ThemeContext";

export function FloatingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Sorting", href: "/sorting" },
    { name: "Graphs", href: "/graphs" },
    { name: "Trees", href: "/trees" },
    { name: "Pathfinding", href: "/pathfinding" },
    { name: "DP", href: "/dp" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] }}
        className={cn(
          "fixed top-0 z-50 flex w-full justify-center px-4 py-4 transition-all duration-300",
          isScrolled ? "pt-4" : "pt-6"
        )}
      >
        <div
          className={cn(
            "flex w-full max-w-6xl items-center justify-between rounded-full border transition-all duration-500",
            isScrolled 
              ? "border-white/10 bg-black/40 px-6 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-md"
              : "border-transparent bg-transparent px-4 py-2"
          )}
        >
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-[0_0_15px_rgba(124,58,237,0.5)] transition-transform duration-300 group-hover:scale-110">
              <Zap size={18} fill="currentColor" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              ThunderStorm
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium transition-colors"
                >
                  <span className={cn(
                    "relative z-10",
                    isActive ? "text-white" : "text-white/60 hover:text-white"
                  )}>
                    {link.name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 rounded-full bg-white/10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">


            <button
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/80 transition-colors hover:bg-white/10 hover:text-white md:hidden"
            >
              {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-20 z-40 rounded-2xl border border-white/10 bg-[#0a0a0a]/95 p-4 shadow-2xl backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {link.name}
                </Link>
              ))}
              <div className="my-2 h-px w-full bg-white/10" />

            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
