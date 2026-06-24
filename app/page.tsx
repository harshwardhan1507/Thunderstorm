import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-slate-950 px-6 py-12 relative overflow-hidden font-mono">
      {/* Dynamic background lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="z-10 max-w-4xl w-full text-center flex flex-col items-center gap-8">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-border-strong text-[11px] font-bold tracking-widest text-slate-300 uppercase shadow-inner">
          <span className="w-2 h-2 rounded-full bg-swap animate-ping"></span>
          Now Live: Phase 1 sorting
        </div>

        {/* Main Hero Header */}
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none">
            Visualize Algorithms at the Speed of{" "}
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-yellow-300 bg-clip-text text-transparent">
              Lightning
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 leading-relaxed font-sans mt-3">
            A portfolio-grade web app that visualizes sorting, graph, pathfinding, tree, dynamic programming,
            and greedy algorithms step-by-step. Built with high-performance Canvas rendering, GSAP animations, 
            and a multi-language code panel synced in real-time.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full justify-center">
          <Link
            href="/sorting"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-compare hover:bg-blue-400 text-white font-bold tracking-wider shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer text-sm"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Explore Sorting Visualizer
          </Link>
          <span
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-slate-900 border border-border-strong text-slate-500 font-bold tracking-wider cursor-not-allowed text-sm"
            title="Coming in Phase 2"
          >
            Pathfinding Grid (Soon)
          </span>
        </div>

        {/* Grid Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-12 text-left">
          <div className="bg-slate-900/60 backdrop-blur border border-border-strong rounded-xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider mb-2">
              <span className="text-compare font-black">#01</span> Generator Steps
            </h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Algorithms yield steps as pure data. Play, pause, step forward, backward, or scrub the timeline instantly at any speed.
            </p>
          </div>
          <div className="bg-slate-900/60 backdrop-blur border border-border-strong rounded-xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider mb-2">
              <span className="text-swap font-black">#02</span> Synced Code Panel
            </h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Dynamically switch between Java, Python, C++, and JavaScript. Highlights the active line of code in perfect sync with the visualization.
            </p>
          </div>
          <div className="bg-slate-900/60 backdrop-blur border border-border-strong rounded-xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider mb-2">
              <span className="text-traverse font-black">#03</span> Pure Performance
            </h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              High-performance HTML5 Canvas rendering for sorting bars avoids DOM paint bottlenecks, maintaining a fluid 60 FPS even on large datasets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
