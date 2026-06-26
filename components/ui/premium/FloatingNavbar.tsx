"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { CommandPalette } from "@/components/layout/CommandPalette";

export function FloatingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [navHeight, setNavHeight] = useState(1);
  const pathname = usePathname();

  // Handle scroll effect with shrinking animation
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);
      // Shrink navbar as user scrolls
      const scrollPercent = Math.min(window.scrollY / 100, 1);
      setNavHeight(1 - scrollPercent * 0.15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
          "fixed top-0 z-50 flex w-full justify-center px-4 transition-all duration-300",
          isScrolled ? "py-3" : "py-6"
        )}
      >
        <motion.div
          style={{ scale: navHeight }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn(
            "flex w-full max-w-6xl items-center justify-between rounded-2xl border transition-all duration-500",
            isScrolled
              ? "border-white/15 bg-black/30 px-6 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl"
              : "border-white/10 bg-white/5 px-6 py-4 shadow-[0_4px_24px_rgba(0,0,0,0.15)] backdrop-blur-md"
          )}
        >
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2 flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-[0_0_15px_rgba(124,58,237,0.5)] transition-transform duration-300"
            >
              <Zap size={18} fill="currentColor" />
            </motion.div>
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg font-bold tracking-tight text-white hidden sm:inline"
            >
              ThunderStorm
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
              return (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="relative px-4 py-2 text-sm font-medium transition-colors"
                  >
                    <span className={cn(
                      "relative z-10 transition-colors duration-300",
                      isActive ? "text-white" : "text-white/60 hover:text-white"
                    )}>
                      {link.name}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 rounded-full bg-primary/20 border border-primary/50"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Search Bar */}
          <motion.button
            onClick={() => setIsCommandPaletteOpen(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 transition-all hover:bg-white/10 md:flex"
          >
            <Search size={16} className="text-white/50" />
            <span className="w-32 text-left text-sm text-white/50">Search...</span>
            <span className="text-xs text-white/30 ml-auto">Ctrl+K</span>
          </motion.button>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/80 transition-colors hover:bg-white/10 hover:text-white md:hidden"
          >
            {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </motion.button>
        </motion.div>
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
              <button
                onClick={() => {
                  setIsCommandPaletteOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Search size={16} />
                Search
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command Palette */}
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />
    </>
  );
}
