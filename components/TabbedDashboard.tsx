'use client';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Zap, BarChart3, Shuffle, Network, Route, TreePine, Layers, TrendingUp, Hash, Award, Activity, Timer } from 'lucide-react';
import { useTheme } from '../lib/context/ThemeContext';
import { themeColors } from '../lib/theme/colors';

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  trend: string;
}

function StatCard({ label, value, icon, color, trend }: StatCardProps) {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  return (
    <div 
      className="rounded-lg p-2.5 border transition-colors duration-300"
      style={{
        backgroundColor: colors.bg.tertiary,
        borderColor: colors.border.primary,
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] transition-colors duration-300" style={{ color: colors.text.tertiary }}>
          {label}
        </span>
        <span style={{ color }}>{icon}</span>
      </div>
      <div className="text-lg font-bold tabular-nums transition-colors duration-300" style={{ color: colors.text.primary }}>
        {value.toLocaleString()}
      </div>
      <div className="text-[9px] mt-0.5" style={{ color: '#22C55E' }}>
        {trend}
      </div>
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
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const [activeTab, setActiveTab] = useState('sorting');
  const [stats, setStats] = useState({
    problems: 1341,
    algorithms: 525,
    streak: 12,
  });
  const animationStarted = useRef(false);

  // Animate counters only once on mount
  useEffect(() => {
    if (animationStarted.current) return;
    animationStarted.current = true;

    let interval: NodeJS.Timeout | null = null;
    const t1 = setTimeout(() => {
      let p = 0, a = 0, s = 0;
      interval = setInterval(() => {
        p = Math.min(p + 47, 1341);
        a = Math.min(a + 26, 525);
        s = Math.min(s + 1, 12);
        setStats({ problems: p, algorithms: a, streak: s });
        if (p >= 1341 && interval) clearInterval(interval);
      }, 16);
    }, 600);
    return () => {
      clearTimeout(t1);
      if (interval) clearInterval(interval);
    };
  }, []);

  const contentMap = useMemo(() => ({
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
  }), []);

  const content = contentMap[activeTab] || contentMap.sorting;

  const handleTabClick = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  const headerStyle = {
    backgroundColor: colors.bg.secondary,
    borderColor: colors.border.secondary,
  };

  const tabsContainerStyle = {
    backgroundColor: colors.bg.primary,
    borderColor: colors.border.secondary,
  };

  const contentContainerStyle = {
    backgroundColor: colors.bg.primary,
  };

  const sidebarStyle = {
    backgroundColor: colors.bg.secondary,
    borderColor: colors.border.primary,
  };

  return (
    <div className={`relative w-full max-w-3xl mx-auto transition-colors duration-300 ${className}`}>
      <div 
        className="rounded-2xl border overflow-hidden shadow-lg transition-colors duration-300"
        style={{
          backgroundColor: colors.bg.primary,
          borderColor: colors.border.primary,
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b transition-colors duration-300" style={headerStyle}>
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div 
              className="flex items-center gap-2 rounded-md px-3 py-1 text-xs border transition-colors duration-300"
              style={{
                backgroundColor: colors.bg.tertiary,
                borderColor: colors.border.primary,
                color: colors.text.secondary,
              }}
            >
              <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
              thunderstorm.dev/dashboard
            </div>
          </div>
          <div 
            className="text-xs rounded px-2 py-0.5 border transition-colors duration-300"
            style={{
              backgroundColor: colors.bg.tertiary,
              borderColor: colors.border.primary,
              color: colors.text.secondary,
            }}
          >
            Live
          </div>
        </div>

        {/* Tabs */}
        <div 
          className="flex border-b overflow-x-auto transition-colors duration-300"
          style={tabsContainerStyle}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className="flex items-center gap-1.5 px-4 py-3 text-xs font-medium whitespace-nowrap transition-colors duration-200 border-b-2"
              style={{
                color: activeTab === tab.id ? colors.accent : colors.text.secondary,
                borderColor: activeTab === tab.id ? colors.accent : 'transparent',
                backgroundColor: activeTab === tab.id ? colors.bg.tertiary : 'transparent',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex h-[340px] transition-colors duration-300" style={contentContainerStyle}>
          {/* Sidebar */}
          <div 
            className="w-44 border-r flex flex-col py-3 gap-0.5 shrink-0 transition-colors duration-300"
            style={sidebarStyle}
          >
            <div className="flex items-center gap-2 px-3 py-1.5 mb-2">
              <Zap className="w-4 h-4" style={{ color: colors.accent }} />
              <span className="text-xs font-semibold transition-colors duration-300" style={{ color: colors.text.primary }}>
                ThunderStorm
              </span>
            </div>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className="flex items-center gap-2 px-3 py-1.5 mx-1.5 rounded-md text-[10px] transition-colors duration-200 border-l-2"
                style={{
                  color: activeTab === tab.id ? colors.accentLight : colors.text.secondary,
                  backgroundColor: activeTab === tab.id ? (theme === 'dark' ? 'rgba(124, 58, 237, 0.15)' : 'rgba(124, 58, 237, 0.1)') : 'transparent',
                  borderColor: activeTab === tab.id ? colors.accent : 'transparent',
                }}
              >
                <span style={{ color: activeTab === tab.id ? colors.accent : 'inherit' }}>
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold transition-colors duration-300" style={{ color: colors.text.primary }}>
                  {content.title}
                </h3>
                <p className="text-[10px] transition-colors duration-300" style={{ color: colors.text.tertiary }}>
                  {content.description}
                </p>
              </div>
              <button 
                className="text-[10px] text-white rounded-md px-2.5 py-1 font-medium transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: colors.accent }}
              >
                Start Visualizing
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <StatCard
                label="Problems Solved"
                value={stats.problems}
                icon={<Hash className="w-3 h-3" />}
                color={colors.accent}
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
            <div 
              className="rounded-lg p-2.5 flex-1 border transition-colors duration-300"
              style={{
                backgroundColor: colors.bg.tertiary,
                borderColor: colors.border.primary,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-medium transition-colors duration-300" style={{ color: colors.text.secondary }}>
                  Algorithm Progress
                </span>
                <span 
                  className="text-[9px] rounded px-1.5 py-0.5 border transition-colors duration-300"
                  style={{
                    color: colors.text.tertiary,
                    backgroundColor: colors.bg.primary,
                    borderColor: colors.border.primary,
                  }}
                >
                  This Month
                </span>
              </div>
              <div className="flex items-end gap-1 h-12">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm transition-colors duration-300"
                    style={{
                      height: `${h}%`,
                      background: i === 11 ? `linear-gradient(to top, ${colors.accent}, ${colors.accentLight})` : `rgba(124, 58, 237, ${theme === 'dark' ? 0.25 : 0.15})`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Badges */}
      <div 
        className="absolute -top-3 -right-3 rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg border transition-colors duration-300"
        style={{
          backgroundColor: colors.bg.tertiary,
          borderColor: colors.border.primary,
        }}
      >
        <Activity className="w-3.5 h-3.5 text-[#22C55E]" />
        <span className="text-[10px] font-medium transition-colors duration-300" style={{ color: colors.text.primary }}>
          Live Visualizer
        </span>
      </div>
      <div 
        className="absolute -bottom-3 -left-3 rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg border transition-colors duration-300"
        style={{
          backgroundColor: colors.bg.tertiary,
          borderColor: colors.border.primary,
        }}
      >
        <Timer className="w-3.5 h-3.5 text-[#3B82F6]" />
        <span className="text-[10px] font-medium transition-colors duration-300" style={{ color: colors.text.primary }}>
          Step-by-step
        </span>
      </div>
    </div>
  );
};

export default TabbedDashboard;
