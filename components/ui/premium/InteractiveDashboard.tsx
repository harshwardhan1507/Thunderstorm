"use client";

import { motion } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, Code2, Layers, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function InteractiveDashboard() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeTab, setActiveTab] = useState("visualization");
  const [bars, setBars] = useState<number[]>([]);

  // Generate random bars
  useEffect(() => {
    setBars(Array.from({ length: 20 }, () => Math.floor(Math.random() * 80) + 20));
  }, []);

  // Animate bars if playing
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setBars(prev => {
        const newBars = [...prev];
        const idx1 = Math.floor(Math.random() * newBars.length);
        const idx2 = Math.floor(Math.random() * newBars.length);
        
        // Swap animation
        const temp = newBars[idx1];
        newBars[idx1] = newBars[idx2];
        newBars[idx2] = temp;
        
        return newBars;
      });
    }, 800);
    
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <Link href="/sorting">
      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, ease: [0.2, 0.65, 0.3, 0.9], delay: 0.2 }}
        whileHover={{ y: -10, rotateX: 5 }}
        className="relative mx-auto w-full max-w-5xl perspective-1000 cursor-pointer group"
      >
        {/* Glow effect behind dashboard */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-b from-primary/50 to-purple-600/20 opacity-50 blur-2xl group-hover:opacity-75 transition-opacity" />
        
        {/* Main dashboard window */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]/90 shadow-2xl backdrop-blur-2xl group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-all duration-300">
          
          {/* Mac-style window controls */}
          <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
            <div className="flex gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
            </div>
            <div className="mx-auto flex space-x-1 rounded-lg bg-black/40 p-1">
              <button 
                onClick={(e) => { e.preventDefault(); setActiveTab("visualization"); }}
                className={cn("px-3 py-1 text-xs font-medium rounded-md transition-colors", activeTab === "visualization" ? "bg-white/10 text-white" : "text-white/50 hover:text-white/80")}
              >
                Visualization
              </button>
              <button 
                onClick={(e) => { e.preventDefault(); setActiveTab("code"); }}
                className={cn("px-3 py-1 text-xs font-medium rounded-md transition-colors", activeTab === "code" ? "bg-white/10 text-white" : "text-white/50 hover:text-white/80")}
              >
                Code
              </button>
              <button 
                onClick={(e) => { e.preventDefault(); setActiveTab("metrics"); }}
                className={cn("px-3 py-1 text-xs font-medium rounded-md transition-colors", activeTab === "metrics" ? "bg-white/10 text-white" : "text-white/50 hover:text-white/80")}
              >
                Metrics
              </button>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
            
            {/* Main Visualization Area */}
            <div className="col-span-1 flex flex-col gap-4 md:col-span-2">
              <div className="relative flex h-64 items-end justify-center gap-1 overflow-hidden rounded-xl border border-white/5 bg-black/40 p-4">
                {activeTab === "visualization" ? (
                  bars.map((height, i) => (
                    <motion.div
                      key={i}
                      layout
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="w-full max-w-[20px] rounded-t-sm bg-gradient-to-t from-primary/80 to-purple-400"
                      style={{ height: `${height}%` }}
                    />
                  ))
                ) : activeTab === "code" ? (
                  <div className="h-full w-full text-left text-sm font-mono text-white/70">
                    <p className="text-purple-400">function <span className="text-blue-400">quickSort</span>(arr) {'{'}</p>
                    <p className="pl-4 text-gray-400">if (arr.length {'<='} 1) return arr;</p>
                    <p className="pl-4 text-gray-400">let pivot = arr[0];</p>
                    <p className="pl-4 text-gray-400">let left = [];</p>
                    <p className="pl-4 text-gray-400">let right = [];</p>
                    <p className="pl-4 text-purple-400">for <span className="text-gray-400">(let i = 1; i {'<'} arr.length; i++) {'{'}</span></p>
                    <p className="pl-8 text-gray-400">if (arr[i] {'<'} pivot) left.push(arr[i]);</p>
                    <p className="pl-8 text-gray-400">else right.push(arr[i]);</p>
                    <p className="pl-4 text-gray-400">{'}'}</p>
                    <p className="pl-4 text-purple-400">return <span className="text-gray-400">[...quickSort(left), pivot, ...quickSort(right)];</span></p>
                    <p>{'}'}</p>
                  </div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="grid grid-cols-2 gap-4 w-full">
                      <div className="rounded-lg bg-white/5 p-4 text-center">
                        <p className="text-xs text-white/50">Time Complexity</p>
                        <p className="text-xl font-bold text-green-400">O(n log n)</p>
                      </div>
                      <div className="rounded-lg bg-white/5 p-4 text-center">
                        <p className="text-xs text-white/50">Space Complexity</p>
                        <p className="text-xl font-bold text-yellow-400">O(log n)</p>
                      </div>
                      <div className="rounded-lg bg-white/5 p-4 text-center">
                        <p className="text-xs text-white/50">Comparisons</p>
                        <p className="text-xl font-bold text-blue-400">1,248</p>
                      </div>
                      <div className="rounded-lg bg-white/5 p-4 text-center">
                        <p className="text-xs text-white/50">Swaps</p>
                        <p className="text-xl font-bold text-purple-400">412</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Playback Controls */}
              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-6 py-3">
                <div className="flex items-center gap-4">
                  <button onClick={(e) => e.preventDefault()} className="text-white/50 hover:text-white"><SkipBack size={18} /></button>
                  <button 
                    onClick={(e) => { e.preventDefault(); setIsPlaying(!isPlaying); }}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-[0_0_15px_rgba(124,58,237,0.5)] transition-transform hover:scale-105"
                  >
                    {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
                  </button>
                  <button onClick={(e) => e.preventDefault()} className="text-white/50 hover:text-white"><SkipForward size={18} /></button>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/50">Speed</span>
                  <div className="h-1.5 w-24 rounded-full bg-white/10">
                    <div className="h-full w-2/3 rounded-full bg-primary" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Side Panel */}
            <div className="col-span-1 flex flex-col gap-4">
              <div className="flex-1 rounded-xl border border-white/5 bg-white/5 p-5">
                <h4 className="mb-4 text-sm font-semibold text-white/80">Algorithm Selection</h4>
                
                <div className="space-y-2">
                  {["Quick Sort", "Merge Sort", "Heap Sort", "Bubble Sort"].map((algo, i) => (
                    <div 
                      key={algo} 
                      className={cn(
                        "flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                        i === 0 ? "bg-primary/20 text-primary" : "text-white/60 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <span>{algo}</span>
                      {i === 0 && <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(124,58,237,0.8)]" />}
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 border-t border-white/10 pt-4">
                  <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-white/40">Live Execution</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                        <Code2 size={12} />
                      </div>
                      <span className="text-xs text-white/60">Comparing elements...</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
                        <Layers size={12} />
                      </div>
                      <span className="text-xs text-white/60">Swapping values...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>

          {/* CTA Overlay on Hover */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 text-white font-semibold">
              Click to Explore
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Link>
  );
}
