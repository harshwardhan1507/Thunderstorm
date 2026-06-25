'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Zap, Code2, GitBranch, Network, TreePine, BarChart3, Cpu,
  Globe, MessageCircle, Monitor, GraduationCap, Clipboard,
  FileQuestion, Newspaper, ArrowRight, Play, Users, Star,
  TrendingUp, Award, BookOpen, Layers, Shuffle, Route,
  ChevronRight, Activity, Timer, Hash
} from 'lucide-react';

interface OrbitItem { icon: React.ReactNode; angle: number; }
interface OrbitRingProps { radius: number; duration: number; items: OrbitItem[]; id: string; }

function OrbitRing({ radius, duration, items, id }: OrbitRingProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <svg className="absolute inset-0 size-full" viewBox="0 0 1400 1400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`ring-grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(124,58,237,0.25)" />
            <stop offset="100%" stopColor="rgba(124,58,237,0)" />
          </linearGradient>
        </defs>
        <circle cx="700" cy="700" r={radius} fill="none" stroke={`url(#ring-grad-${id})`} strokeWidth="1" />
      </svg>
      {items.map((item, i) => (
        <div
          key={i}
          className="absolute flex items-center justify-center animate-orbit"
          style={{
            '--duration': duration,
            '--radius': radius,
            '--angle': item.angle,
            '--icon-size': '30px',
            width: 'var(--icon-size)',
            height: 'var(--icon-size)',
          } as React.CSSProperties}
        >
          <div className="flex items-center justify-center rounded-xl border border-[#2a2a2a] bg-[#141414]/90 backdrop-blur-md px-3 py-2 shadow-[0_2px_12px_rgba(124,58,237,0.10)]">
            <div className="text-[#8b5cf6]">{item.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DashboardWidget() {
  const [rank, setRank] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => {
      let r = 0, s = 0, st = 0;
      const interval = setInterval(() => {
        r = Math.min(r + 47, 1341); s = Math.min(s + 26, 525); st = Math.min(st + 1, 12);
        setRank(r); setScore(s); setStreak(st);
        if (r >= 1341) clearInterval(interval);
      }, 16);
    }, 600);
    return () => clearTimeout(t1);
  }, []);
  return (
    <div className="relative w-full max-w-3xl mx-auto animate-float" style={{ animationDelay: '0.3s' }}>
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#0d0d0d] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(124,58,237,0.06)]">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1e1e1e] bg-[#111111]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-2 bg-[#1a1a1a] rounded-md px-3 py-1 text-xs text-[#555555] border border-[#2a2a2a]">
              <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
              thunderstorm.dev/dashboard
            </div>
          </div>
          <div className="text-xs text-[#555555] bg-[#1a1a1a] border border-[#2a2a2a] rounded px-2 py-0.5">Live</div>
        </div>
        <div className="flex h-[340px]">
          <div className="w-44 border-r border-[#1e1e1e] bg-[#0d0d0d] flex flex-col py-3 gap-0.5 shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 mb-2">
              <Zap className="w-4 h-4 text-[#7c3aed]" />
              <span className="text-xs font-semibold text-[#f0f0f0]">ThunderStorm</span>
            </div>
            {[
              { icon: <BarChart3 className="w-3.5 h-3.5" />, label: 'Dashboard', active: true },
              { icon: <Shuffle className="w-3.5 h-3.5" />, label: 'Sorting' },
              { icon: <Network className="w-3.5 h-3.5" />, label: 'Graphs' },
              { icon: <Route className="w-3.5 h-3.5" />, label: 'Pathfinding' },
              { icon: <TreePine className="w-3.5 h-3.5" />, label: 'Trees' },
              { icon: <Layers className="w-3.5 h-3.5" />, label: 'Dynamic Prog.' },
              { icon: <TrendingUp className="w-3.5 h-3.5" />, label: 'Greedy' },
            ].map((item) => (
              <div key={item.label} className={`flex items-center gap-2 px-3 py-1.5 mx-1.5 rounded-md text-[10px] transition-colors ${item.active ? 'bg-[#7c3aed]/15 text-[#a78bfa] border-l-2 border-[#7c3aed]' : 'text-[#555555]'}`}>
                <span className={item.active ? 'text-[#7c3aed]' : ''}>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
          <div className="flex-1 p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-[#f0f0f0]">Dashboard</h3>
                <p className="text-[10px] text-[#555555]">An exciting algorithm is waiting for you</p>
              </div>
              <button className="text-[10px] bg-[#7c3aed] text-white rounded-md px-2.5 py-1 font-medium">Start Visualizing</button>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { label: 'Problems Solved', value: rank, icon: <Hash className="w-3 h-3" />, color: '#7c3aed', trend: '+7% since last week' },
                { label: 'Algorithms Mastered', value: score, icon: <Award className="w-3 h-3" />, color: '#3B82F6', trend: '+2.1% since last month' },
                { label: 'Day Streak', value: streak, icon: <Zap className="w-3 h-3" />, color: '#22C55E', trend: 'Keep it up!' },
              ].map((stat) => (
                <div key={stat.label} className="bg-[#141414] border border-[#2a2a2a] rounded-lg p-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] text-[#555555]">{stat.label}</span>
                    <span style={{ color: stat.color }}>{stat.icon}</span>
                  </div>
                  <div className="text-lg font-bold text-[#f0f0f0] tabular-nums">{stat.value.toLocaleString()}</div>
                  <div className="text-[9px] text-[#22C55E] mt-0.5">{stat.trend}</div>
                </div>
              ))}
            </div>
            <div className="bg-[#141414] border border-[#2a2a2a] rounded-lg p-2.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-[#888888] font-medium">Algorithm Progress</span>
                <span className="text-[9px] text-[#555555] bg-[#1c1c1c] border border-[#2a2a2a] rounded px-1.5 py-0.5">This Month</span>
              </div>
              <div className="flex items-end gap-1 h-12">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                  <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: i === 11 ? 'linear-gradient(to top, #7c3aed, #a78bfa)' : 'rgba(124,58,237,0.25)' }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -top-3 -right-3 bg-[#141414] border border-[#2a2a2a] rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg">
        <Activity className="w-3.5 h-3.5 text-[#22C55E]" />
        <span className="text-[10px] text-[#f0f0f0] font-medium">Live Visualizer</span>
      </div>
      <div className="absolute -bottom-3 -left-3 bg-[#141414] border border-[#2a2a2a] rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg">
        <Timer className="w-3.5 h-3.5 text-[#3B82F6]" />
        <span className="text-[10px] text-[#f0f0f0] font-medium">Step-by-step</span>
      </div>
    </div>
  );
}

interface MarqueeItem { name: string; role: string; initials: string; color: string; }
function MarqueeRow({ items, reverse }: { items: MarqueeItem[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden w-full">
      <div className={reverse ? 'animate-marquee-reverse' : 'animate-marquee'} style={{ '--duration': '28s', display: 'flex', gap: '12px', width: 'max-content' } as React.CSSProperties}>
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-3 bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 shrink-0 min-w-[220px]">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: item.color }}>{item.initials}</div>
            <div>
              <div className="text-xs font-semibold text-[#f0f0f0]">{item.name}</div>
              <div className="text-[10px] text-[#555555]">{item.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCounter({ target, suffix, label, icon }: { target: number; suffix: string; label: string; icon: React.ReactNode }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1800; const step = 16;
        const increment = target / (duration / step);
        let current = 0;
        const timer = setInterval(() => {
          current = Math.min(current + increment, target);
          setCount(Math.floor(current));
          if (current >= target) clearInterval(timer);
        }, step);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return (
    <div ref={ref} className="flex flex-col items-center gap-2 group cursor-pointer">
      <div className="w-12 h-12 rounded-2xl bg-[#141414] border border-[#2a2a2a] flex items-center justify-center text-[#7c3aed] group-hover:border-[#7c3aed]/50 transition-colors">{icon}</div>
      <div className="text-3xl font-bold text-[#f0f0f0] tabular-nums">{count.toLocaleString()}{suffix}</div>
      <div className="text-sm text-[#555555]">{label}</div>
    </div>
  );
}

function FeatureCard({ title, description, icon, preview, accent, delay = 0 }: { title: string; description: string; icon: React.ReactNode; preview: React.ReactNode; accent: string; delay?: number }) {
  return (
    <div className="relative flex flex-col gap-4 bg-[#0d0d0d] border border-[#2a2a2a] rounded-2xl p-5 overflow-hidden group hover:border-[#333333] transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(circle at 30% 30%, ${accent}08 0%, transparent 70%)` }} />
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}>
          <div style={{ color: accent }}>{icon}</div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#f0f0f0]">{title}</h3>
          <p className="text-xs text-[#555555] mt-0.5 leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="rounded-xl border border-[#1e1e1e] bg-[#111111] overflow-hidden">{preview}</div>
    </div>
  );
}

function ResourceCard({ icon, title, description, href, accent }: { icon: React.ReactNode; title: string; description: string; href: string; accent: string }) {
  return (
    <Link href={href} className="flex items-start gap-3 bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#333333] hover:bg-[#111111] transition-all duration-200 group">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${accent}15`, border: `1px solid ${accent}25` }}>
        <div style={{ color: accent }}>{icon}</div>
      </div>
      <div>
        <div className="text-sm font-semibold text-[#f0f0f0] group-hover:text-white transition-colors">{title}</div>
        <div className="text-[11px] text-[#555555] mt-0.5 leading-relaxed">{description}</div>
      </div>
    </Link>
  );
}

export default function LandingPage() {
  const orbitIcons1: OrbitItem[] = [
    { icon: <Code2 className="w-5 h-5" />, angle: 0 },
    { icon: <Newspaper className="w-5 h-5" />, angle: 40 },
    { icon: <Globe className="w-5 h-5" />, angle: 80 },
    { icon: <MessageCircle className="w-5 h-5" />, angle: 120 },
    { icon: <Monitor className="w-5 h-5" />, angle: 160 },
    { icon: <GraduationCap className="w-5 h-5" />, angle: 200 },
    { icon: <FileQuestion className="w-5 h-5" />, angle: 240 },
    { icon: <Clipboard className="w-5 h-5" />, angle: 280 },
    { icon: <BookOpen className="w-5 h-5" />, angle: 320 },
  ];
  const orbitIcons2: OrbitItem[] = [
    { icon: <Globe className="w-5 h-5" />, angle: 20 },
    { icon: <Clipboard className="w-5 h-5" />, angle: 60 },
    { icon: <FileQuestion className="w-5 h-5" />, angle: 100 },
    { icon: <Monitor className="w-5 h-5" />, angle: 140 },
    { icon: <Newspaper className="w-5 h-5" />, angle: 180 },
    { icon: <Code2 className="w-5 h-5" />, angle: 220 },
    { icon: <MessageCircle className="w-5 h-5" />, angle: 260 },
    { icon: <GraduationCap className="w-5 h-5" />, angle: 300 },
    { icon: <Monitor className="w-5 h-5" />, angle: 340 },
  ];
  const alumni: MarqueeItem[] = [
    { name: 'Arjun Mehta', role: 'SDE at Google', initials: 'AM', color: '#4285F4' },
    { name: 'Priya Sharma', role: 'SWE at Microsoft', initials: 'PS', color: '#00A4EF' },
    { name: 'Rahul Verma', role: 'Engineer at Amazon', initials: 'RV', color: '#FF9900' },
    { name: 'Sneha Patel', role: 'SDE-2 at Flipkart', initials: 'SP', color: '#F74F00' },
    { name: 'Karan Singh', role: 'Backend at Swiggy', initials: 'KS', color: '#FC8019' },
    { name: 'Divya Nair', role: 'SDE at Razorpay', initials: 'DN', color: '#3395FF' },
  ];
  const alumni2: MarqueeItem[] = [
    { name: 'Vikram Joshi', role: 'ML Engineer at NVIDIA', initials: 'VJ', color: '#76B900' },
    { name: 'Ananya Roy', role: 'SDE at Uber', initials: 'AR', color: '#1B1B1B' },
    { name: 'Rohan Das', role: 'Platform at Atlassian', initials: 'RD', color: '#0052CC' },
    { name: 'Meera Iyer', role: 'SWE at Adobe', initials: 'MI', color: '#FF0000' },
    { name: 'Aditya Kumar', role: 'SDE at Paytm', initials: 'AK', color: '#00BAF2' },
    { name: 'Pooja Gupta', role: 'Engineer at Zomato', initials: 'PG', color: '#E23744' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a]">

      {/* HERO */}
      <section className="relative w-full overflow-hidden flex flex-col items-center pt-24 pb-0">
        <div className="pointer-events-none absolute top-[40%] left-1/2 -z-10 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.18)_0%,transparent_70%)] animate-pulse-glow" />
          <div className="absolute inset-[15%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.10)_0%,transparent_70%)]" />
        </div>
        <div className="pointer-events-none absolute top-[200px] left-1/2 -z-10 h-[1400px] w-[1400px] -translate-x-1/2 -translate-y-1/2 hidden lg:block">
          <OrbitRing radius={420} duration={80} items={orbitIcons1} id="ring1" />
          <OrbitRing radius={560} duration={120} items={orbitIcons2} id="ring2" />
        </div>

        <div className="flex items-center gap-2 bg-[#141414] border border-[#2a2a2a] rounded-full px-4 py-1.5 mb-6 animate-fade-in-up">
          <Zap className="w-3.5 h-3.5 text-[#7c3aed]" />
          <span className="text-xs text-[#888888] font-medium">India&apos;s #1 Algorithm Visualizer</span>
        </div>

        <h1 className="text-center font-bold text-[#f0f0f0] leading-tight mb-4 animate-fade-in-up px-4" style={{ animationDelay: '100ms', fontSize: 'clamp(2.4rem, 6vw, 4.5rem)' }}>
          Visualize Algorithms<br />
          <span className="bg-gradient-to-r from-[#7c3aed] via-[#a78bfa] to-[#3B82F6] bg-clip-text text-transparent">Like Never Before</span>
        </h1>

        <p className="text-center text-[#888888] max-w-xl mx-auto mb-8 leading-relaxed animate-fade-in-up px-4" style={{ animationDelay: '200ms', fontSize: 'clamp(0.9rem, 2vw, 1.05rem)' }}>
          ThunderStorm gives you a fully interactive path to mastering DSA — sorting, graphs, pathfinding, trees, dynamic programming and more, all in one system.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-16 animate-fade-in-up px-4" style={{ animationDelay: '300ms' }}>
          <Link href="/sorting" className="flex items-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-200 shadow-[0_0_24px_rgba(124,58,237,0.35)] hover:shadow-[0_0_32px_rgba(124,58,237,0.5)]">
            <Play className="w-4 h-4" /> Launch Visualizer
          </Link>
          <Link href="/compare" className="flex items-center gap-2 bg-[#141414] hover:bg-[#1c1c1c] text-[#f0f0f0] border border-[#2a2a2a] hover:border-[#333333] rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-200">
            Compare Algorithms <ChevronRight className="w-4 h-4 text-[#555555]" />
          </Link>
        </div>

        <div className="w-full max-w-3xl px-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <DashboardWidget />
        </div>
      </section>

      {/* TRUSTED BY */}
      <section className="w-full py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#f0f0f0] leading-tight mb-6">
                Trusted by Learners.<br /><span className="text-[#555555]">Built for the Future.</span>
              </h2>
              <div className="flex flex-col gap-4">
                {[
                  { icon: <Award className="w-4 h-4" />, title: 'Proven Results', desc: "Thousands have cracked placements using ThunderStorm's visual learning approach." },
                  { icon: <BookOpen className="w-4 h-4" />, title: 'Step-by-Step Learning', desc: 'Every algorithm explained with live animations, code panels, and complexity charts.' },
                  { icon: <TrendingUp className="w-4 h-4" />, title: 'Interview Ready', desc: 'Skills that translate directly into coding interviews and real-world problem solving.' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#7c3aed]/15 border border-[#7c3aed]/25 flex items-center justify-center text-[#7c3aed] shrink-0 mt-0.5">{item.icon}</div>
                    <div>
                      <div className="text-sm font-semibold text-[#f0f0f0]">{item.title}</div>
                      <div className="text-xs text-[#555555] mt-0.5 leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 overflow-hidden">
              <MarqueeRow items={alumni} />
              <MarqueeRow items={alumni2} reverse />
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="w-full py-16 border-y border-[#1a1a1a] bg-[#0d0d0d]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCounter target={50000} suffix="+" label="Active Learners" icon={<Users className="w-5 h-5" />} />
            <StatCounter target={12} suffix="+" label="Algorithm Categories" icon={<Layers className="w-5 h-5" />} />
            <StatCounter target={48} suffix="+" label="Algorithms Covered" icon={<Code2 className="w-5 h-5" />} />
            <StatCounter target={4} suffix="+" label="Languages Supported" icon={<Globe className="w-5 h-5" />} />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="w-full py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#f0f0f0] mb-3">Features That Power Your Learning</h2>
            <p className="text-[#555555] max-w-xl mx-auto text-sm leading-relaxed">Everything you need in one place — from step-by-step animations to AI-powered code analysis.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard title="Step-by-Step Visualizer" description="Watch every comparison, swap, and traversal happen in real time with full playback controls." icon={<Play className="w-4 h-4" />} accent="#7c3aed" delay={0}
              preview={<div className="p-3"><div className="flex items-end gap-1 h-16 mb-2">{[60,30,80,45,90,20,70,55].map((h,i)=><div key={i} className="flex-1 rounded-sm" style={{height:`${h}%`,background:i===3?'#FACC15':i===4?'#7c3aed':'rgba(124,58,237,0.3)'}}/>)}</div><div className="flex items-center gap-2 justify-center">{['⏮','⏪','▶','⏩','⏭'].map((btn,i)=><button key={i} className="w-6 h-6 rounded bg-[#1c1c1c] border border-[#2a2a2a] text-[10px] flex items-center justify-center text-[#888888]">{btn}</button>)}</div></div>}
            />
            <FeatureCard title="Multi-Language Code Panel" description="See the exact algorithm in JavaScript, Python, Java, and C++ with active line highlighting." icon={<Code2 className="w-4 h-4" />} accent="#3B82F6" delay={100}
              preview={<div className="p-3 font-mono text-[10px]"><div className="flex gap-1.5 mb-2">{['JS','PY','Java','C++'].map((lang,i)=><span key={lang} className={`px-2 py-0.5 rounded text-[9px] ${i===0?'bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/30':'text-[#555555]'}`}>{lang}</span>)}</div><div className="text-[#60A5FA]">function <span className="text-[#f0f0f0]">bubbleSort</span>(arr) {'{'}</div><div className="text-[#555555] pl-3">let n = arr.length;</div><div className="text-[#FACC15] pl-3">{'// comparing...'}</div><div className="text-[#555555]">{'}'}</div></div>}
            />
            <FeatureCard title="Real-Time Metrics" description="Track comparisons, swaps, time complexity, and heap memory usage as the algorithm runs." icon={<Activity className="w-4 h-4" />} accent="#22C55E" delay={200}
              preview={<div className="p-3 grid grid-cols-2 gap-2">{[{label:'Comparisons',value:'247',color:'#7c3aed'},{label:'Swaps',value:'89',color:'#3B82F6'},{label:'Time',value:'12ms',color:'#22C55E'},{label:'Heap',value:'18.2 MB',color:'#F59E0B'}].map(m=><div key={m.label} className="bg-[#1a1a1a] rounded-lg p-2 border border-[#2a2a2a]"><div className="text-[9px] text-[#555555]">{m.label}</div><div className="text-sm font-bold" style={{color:m.color}}>{m.value}</div></div>)}</div>}
            />
            <FeatureCard title="Algorithm Comparison" description="Run two algorithms simultaneously and compare their performance metrics head-to-head." icon={<Shuffle className="w-4 h-4" />} accent="#F59E0B" delay={300}
              preview={<div className="p-3"><div className="grid grid-cols-2 gap-2">{[{name:'Bubble Sort',ops:70,color:'#7c3aed'},{name:'Merge Sort',ops:30,color:'#3B82F6'}].map(algo=><div key={algo.name} className="bg-[#1a1a1a] rounded-lg p-2 border border-[#2a2a2a]"><div className="text-[9px] text-[#555555] mb-1">{algo.name}</div><div className="h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden"><div className="h-full rounded-full" style={{width:`${algo.ops}%`,background:algo.color}}/></div><div className="text-[9px] mt-1" style={{color:algo.color}}>O(n²) vs O(n log n)</div></div>)}</div></div>}
            />
            <FeatureCard title="Complexity Growth Chart" description="Interactive chart showing how each algorithm scales with input size — O(1) to O(n²)." icon={<TrendingUp className="w-4 h-4" />} accent="#06B6D4" delay={400}
              preview={<div className="p-3"><div className="h-16 relative"><svg viewBox="0 0 100 50" className="w-full h-full"><polyline points="0,45 20,40 40,30 60,15 80,5 100,2" fill="none" stroke="#EF4444" strokeWidth="1.5" opacity="0.7"/><polyline points="0,45 20,42 40,36 60,28 80,18 100,10" fill="none" stroke="#F59E0B" strokeWidth="1.5" opacity="0.7"/><polyline points="0,45 20,43 40,40 60,36 80,30 100,22" fill="none" stroke="#7c3aed" strokeWidth="1.5" opacity="0.7"/><polyline points="0,45 20,44 40,43 60,41 80,38 100,34" fill="none" stroke="#22C55E" strokeWidth="1.5" opacity="0.7"/></svg></div><div className="flex flex-wrap gap-1.5 mt-1">{[['O(n²)','#EF4444'],['O(n log n)','#F59E0B'],['O(n)','#7c3aed'],['O(log n)','#22C55E']].map(([label,color])=><span key={label} className="text-[8px] px-1.5 py-0.5 rounded" style={{background:`${color}20`,color}}>{label}</span>)}</div></div>}
            />
            <FeatureCard title="AI Code Visualizer" description="Paste any code and let AI detect the algorithm, generate step-by-step animations automatically." icon={<Cpu className="w-4 h-4" />} accent="#a78bfa" delay={500}
              preview={<div className="p-3"><div className="bg-[#1a1a1a] rounded-lg p-2 border border-[#2a2a2a] mb-2 font-mono text-[9px] text-[#555555]"><span className="text-[#60A5FA]">paste</span> your code here...</div><div className="flex items-center gap-2 bg-[#7c3aed]/10 border border-[#7c3aed]/20 rounded-lg p-2"><Cpu className="w-3 h-3 text-[#7c3aed] shrink-0"/><span className="text-[9px] text-[#a78bfa]">AI detected: Quick Sort — generating visualization...</span></div></div>}
            />
          </div>
        </div>
      </section>

      {/* FREE RESOURCES */}
      <section className="w-full py-24 px-4 bg-[#0d0d0d] border-y border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#f0f0f0]">Free Resources</h2>
              <p className="text-sm text-[#555555] mt-1">Start learning with our free visualizers — no signup required.</p>
            </div>
            <Link href="/sorting" className="flex items-center gap-1.5 text-sm text-[#7c3aed] hover:text-[#a78bfa] transition-colors font-medium">View All <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <ResourceCard icon={<Shuffle className="w-4 h-4" />} title="Sorting Algorithms" description="Bubble, Merge, Quick, Heap and more with live animations." href="/sorting" accent="#7c3aed" />
            <ResourceCard icon={<Network className="w-4 h-4" />} title="Graph Algorithms" description="BFS, DFS, Dijkstra, Bellman-Ford visualized step by step." href="/graphs" accent="#3B82F6" />
            <ResourceCard icon={<Route className="w-4 h-4" />} title="Pathfinding" description="A*, Dijkstra, BFS on interactive grid with obstacles." href="/pathfinding" accent="#22C55E" />
            <ResourceCard icon={<TreePine className="w-4 h-4" />} title="Tree Traversals" description="Inorder, Preorder, Postorder, BFS on animated trees." href="/trees" accent="#F59E0B" />
            <ResourceCard icon={<Layers className="w-4 h-4" />} title="Dynamic Programming" description="Fibonacci, Knapsack, LCS with memoization tables." href="/dp" accent="#06B6D4" />
            <ResourceCard icon={<TrendingUp className="w-4 h-4" />} title="Greedy Algorithms" description="Activity selection, Huffman coding, coin change." href="/greedy" accent="#EF4444" />
            <ResourceCard icon={<GitBranch className="w-4 h-4" />} title="Compare Mode" description="Run two algorithms side by side and compare metrics." href="/compare" accent="#a78bfa" />
            <ResourceCard icon={<Cpu className="w-4 h-4" />} title="AI Code Visualizer" description="Paste any code and AI will animate the algorithm for you." href="/code-visualizer" accent="#F59E0B" />
          </div>
        </div>
      </section>

      {/* SIMPLER WAY */}
      <section className="w-full py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#f0f0f0] mb-2">A Smarter Way to Learn DSA</h2>
            <p className="text-sm text-[#555555]">Everything you need — from beginner-friendly visualizations to advanced algorithm analysis.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Theory Simplified', desc: 'Understand fundamentals without confusion. Visual animations replace abstract explanations.', icon: <BookOpen className="w-5 h-5" />, color: '#7c3aed' },
              { title: 'Practice Focused', desc: 'Step through each algorithm at your own pace. Pause, rewind, and replay any step.', icon: <Play className="w-5 h-5" />, color: '#3B82F6' },
              { title: 'Interview Ready', desc: 'See real-world applications of each algorithm. Know when and why to use each approach.', icon: <Award className="w-5 h-5" />, color: '#22C55E' },
            ].map((item, i) => (
              <div key={item.title} className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-2xl p-6 hover:border-[#333333] transition-all duration-200 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}>
                  <div style={{ color: item.color }}>{item.icon}</div>
                </div>
                <h3 className="text-base font-semibold text-[#f0f0f0] mb-2">{item.title}</h3>
                <p className="text-sm text-[#555555] leading-relaxed">{item.desc}</p>
                <button className="mt-4 flex items-center gap-1.5 text-xs font-medium transition-colors" style={{ color: item.color }}>
                  Learn more <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNITY CTA */}
      <section className="w-full py-24 px-4 bg-[#0d0d0d] border-t border-[#1a1a1a]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#7c3aed]/10 border border-[#7c3aed]/20 rounded-full px-4 py-1.5 mb-6">
            <Users className="w-3.5 h-3.5 text-[#7c3aed]" />
            <span className="text-xs text-[#a78bfa] font-medium">Welcome to the ThunderStorm Community</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#f0f0f0] mb-4">
            Join a Community of<br />
            <span className="bg-gradient-to-r from-[#7c3aed] to-[#3B82F6] bg-clip-text text-transparent">Algorithm Enthusiasts</span>
          </h2>
          <p className="text-[#555555] text-sm leading-relaxed mb-8 max-w-lg mx-auto">
            Join thousands of learners where collaboration and innovation come together. Embark on your DSA journey with us.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/sorting" className="flex items-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-full px-6 py-2.5 text-sm font-semibold transition-all shadow-[0_0_24px_rgba(124,58,237,0.35)]">
              <Zap className="w-4 h-4" /> Start Visualizing Free
            </Link>
            <Link href="/compare" className="flex items-center gap-2 bg-[#141414] hover:bg-[#1c1c1c] text-[#f0f0f0] border border-[#2a2a2a] rounded-full px-6 py-2.5 text-sm font-semibold transition-all">
              <Star className="w-4 h-4 text-[#F59E0B]" /> Compare Algorithms
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
