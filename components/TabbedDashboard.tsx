'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Zap, BarChart3, Shuffle, Network, Route, TreePine, Layers, TrendingUp, Hash, Award, Activity, Timer } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  trend: string;
}

function StatCard({ label, value, icon, color, trend }: StatCardProps) {
  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-lg p-2.5">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] text-[#555555]">{label}</span>
        <span style={{ color }}>{icon}</span>
      </div>
      <div className="text-lg font-bold text-[#f0f0f0] tabular-nums">{value.toLocaleString()}</div>
      <div className="text-[9px] text-[#22C55E] mt-0.5">{trend}</div>
    </div>
  );
}

interface TabContent {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const tabs: TabContent[] = [
  { id: 'sorting', label: 'Sorting', icon: <Shuffle className="w-3.5 h-3.5" /> },
  { id: 'graphs', label: 'Graphs', icon: <Network className="w-3.5 h-3.5" /> },
  { id: 'pathfinding', label: 'Pathfinding', icon: <Route className="w-3.5 h-3.5" /> },
  { id: 'trees', label: 'Trees', icon: <TreePine className="w-3.5 h-3.5" /> },
  { id: 'dp', label: 'Dynamic Prog.', icon: <Layers className="w-3.5 h-3.5" /> },
  { id: 'greedy', label: 'Greedy', icon: <TrendingUp className="w-3.5 h-3.5" /> },
];

interface TabbedDashboardProps {
  className?: string;
}

export const TabbedDashboard: React.FC<TabbedDashboardProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('sorting');
  const [stats, setStats] = useState({
    problems: 0,
    algorithms: 0,
    streak: 0,
  });

  // Animate counters on mount
  useEffect(() => {
    const t1 = setTimeout(() => {
      let p = 0, a = 0, s = 0;
      const interval = setInterval(() => {
        p = Math.min(p + 47, 1341);
        a = Math.min(a + 26, 525);
        s = Math.min(s + 1, 12);
        setStats({ problems: p, algorithms: a, streak: s });
        if (p >= 1341) clearInterval(interval);
      }, 16);
    }, 600);
    return () => clearTimeout(t1);
  }, []);

  const getTabContent = () => {
    const contentMap: Record<string, { title: string; description: string; color: string }> = {
      sorting: {
        title: 'Sorting Algorithms',
        description: 'Visualize and compare sorting algorithms with step-by-step execution',
        color: '#7c3aed',
      },
      graphs: {
        title: 'Graph Algorithms',
        description: 'Explore graph traversal and pathfinding algorithms in real-time',
        color: '#3B82F6',
      },
      pathfinding: {
        title: 'Pathfinding',
        description: 'Find optimal paths using Dijkstra and A* algorithms',
        color: '#10B981',
      },
      trees: {
        title: 'Tree Structures',
        description: 'Visualize BST, AVL trees, and heap operations',
        color: '#F59E0B',
      },
      dp: {
        title: 'Dynamic Programming',
        description: 'Master DP concepts with interactive visualizations',
        color: '#EC4899',
      },
      greedy: {
        title: 'Greedy Algorithms',
        description: 'Learn greedy strategies and optimization techniques',
        color: '#06B6D4',
      },
    };

    return contentMap[activeTab] || contentMap.sorting;
  };

  const content = getTabContent();

  return (
    <div className={`relative w-full max-w-3xl mx-auto ${className}`}>
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#0d0d0d] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(124,58,237,0.06)]">
        {/* Header */}
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

        {/* Tabs */}
        <div className="flex border-b border-[#1e1e1e] bg-[#0a0a0a] overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'text-[#7c3aed] border-[#7c3aed] bg-[#0d0d0d]'
                  : 'text-[#555555] border-transparent hover:text-[#888888]'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex h-[340px]">
          {/* Sidebar */}
          <div className="w-44 border-r border-[#1e1e1e] bg-[#0d0d0d] flex flex-col py-3 gap-0.5 shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 mb-2">
              <Zap className="w-4 h-4 text-[#7c3aed]" />
              <span className="text-xs font-semibold text-[#f0f0f0]">ThunderStorm</span>
            </div>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 mx-1.5 rounded-md text-[10px] transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#7c3aed]/15 text-[#a78bfa] border-l-2 border-[#7c3aed]'
                    : 'text-[#555555]'
                }`}
              >
                <span className={activeTab === tab.id ? 'text-[#7c3aed]' : ''}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-[#f0f0f0]">{content.title}</h3>
                <p className="text-[10px] text-[#555555]">{content.description}</p>
              </div>
              <button className="text-[10px] bg-[#7c3aed] text-white rounded-md px-2.5 py-1 font-medium hover:bg-[#8b5cf6] transition-colors">
                Start Visualizing
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <StatCard
                label="Problems Solved"
                value={stats.problems}
                icon={<Hash className="w-3 h-3" />}
                color="#7c3aed"
                trend="+7% since last week"
              />
              <StatCard
                label="Algorithms Mastered"
                value={stats.algorithms}
                icon={<Award className="w-3 h-3" />}
                color="#3B82F6"
                trend="+2.1% since last month"
              />
              <StatCard
                label="Day Streak"
                value={stats.streak}
                icon={<Zap className="w-3 h-3" />}
                color="#22C55E"
                trend="Keep it up!"
              />
            </div>

            {/* Progress Chart */}
            <div className="bg-[#141414] border border-[#2a2a2a] rounded-lg p-2.5 flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-[#888888] font-medium">Algorithm Progress</span>
                <span className="text-[9px] text-[#555555] bg-[#1c1c1c] border border-[#2a2a2a] rounded px-1.5 py-0.5">This Month</span>
              </div>
              <div className="flex items-end gap-1 h-12">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{
                      height: `${h}%`,
                      background: i === 11 ? 'linear-gradient(to top, #7c3aed, #a78bfa)' : 'rgba(124,58,237,0.25)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Badges */}
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
};

export default TabbedDashboard;
