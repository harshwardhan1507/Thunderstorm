'use client';

import React, { useEffect, useState } from 'react';
import { useVisualizerStore } from '../../store/visualizerStore';
import { useGraphStore } from '../../store/graphStore';
import { usePathfindingStore } from '../../store/pathfindingStore';
import { useTreeStore } from '../../store/treeStore';
import { useDPStore } from '../../store/dpStore';
import { SORTING_ALGORITHMS_METADATA } from '../../lib/algorithms/metadata';
import { RefreshCw, ArrowLeftRight, Clock, Activity, GitBranch, Network, Layers, Target, Zap } from 'lucide-react';

import { AnimatedCounter } from './AnimatedCounter';

interface ChromePerformance extends Performance {
  memory?: {
    usedJSHeapSize: number;
  };
}

type VisualizerType = 'sorting' | 'graph' | 'pathfinding' | 'tree' | 'dp';

interface MetricCard {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color?: string;
  rawValue?: number;
}

export const MetricsPanel: React.FC<{ visualizerType?: VisualizerType }> = ({ visualizerType = 'sorting' }) => {
  const { selectedAlgorithm, getMetrics, executionTime } = useVisualizerStore();
  const [heapMemory, setHeapMemory] = useState<string>('N/A');

  // Get metrics based on visualizer type
  const getMetricsByType = (): MetricCard[] => {
    switch (visualizerType) {
      case 'sorting': {
        const { comparisons, swaps } = getMetrics();
        return [
          { label: 'Comparisons', value: comparisons, rawValue: comparisons, icon: RefreshCw },
          { label: 'Swaps', value: swaps, rawValue: swaps, icon: ArrowLeftRight },
          { label: 'Time', value: `${executionTime.toFixed(1)}ms`, rawValue: executionTime, icon: Clock },
          { label: 'Heap', value: heapMemory, icon: Activity },
        ];
      }
      case 'graph': {
        const graphStore = useGraphStore.getState();
        const currentStep = graphStore.steps[graphStore.currentStepIndex];
        const visitedVal = currentStep?.visitedNodes?.length || 0;
        const edgeVal = currentStep?.edgeTrail?.length || 0;
        const stepVal = graphStore.currentStepIndex + 1;
        return [
          { label: 'Nodes Visited', value: visitedVal, rawValue: visitedVal, icon: Network },
          { label: 'Edges Traversed', value: edgeVal, rawValue: edgeVal, icon: GitBranch },
          { label: 'Current Step', value: stepVal, rawValue: stepVal, icon: Layers },
          { label: 'Time', value: `${executionTime.toFixed(1)}ms`, rawValue: executionTime, icon: Clock },
        ];
      }
      case 'pathfinding': {
        const pathStore = usePathfindingStore.getState();
        const currentStep = pathStore.steps[pathStore.currentStepIndex];
        const exploredVal = currentStep?.visited?.length || 0;
        const pathVal = currentStep?.path?.length || 0;
        const stepVal = pathStore.currentStepIndex + 1;
        return [
          { label: 'Nodes Explored', value: exploredVal, rawValue: exploredVal, icon: Network },
          { label: 'Path Length', value: pathVal, rawValue: pathVal, icon: Target },
          { label: 'Current Step', value: stepVal, rawValue: stepVal, icon: Zap },
          { label: 'Time', value: `${executionTime.toFixed(1)}ms`, rawValue: executionTime, icon: Clock },
        ];
      }
      case 'tree': {
        const treeStore = useTreeStore.getState();
        const stepVal = treeStore.currentStepIndex + 1;
        return [
          { label: 'Operations', value: stepVal, rawValue: stepVal, icon: RefreshCw },
          { label: 'Current Step', value: stepVal, rawValue: stepVal, icon: ArrowLeftRight },
          { label: 'Tree Type', value: treeStore.treeType.toUpperCase(), icon: Layers },
          { label: 'Time', value: `${executionTime.toFixed(1)}ms`, rawValue: executionTime, icon: Clock },
        ];
      }
      case 'dp': {
        const dpStore = useDPStore.getState();
        const currentStep = dpStore.steps[dpStore.currentStepIndex];
        const stepVal = dpStore.currentStepIndex + 1;
        const tableSize = currentStep?.table?.length || 0;
        return [
          { label: 'Current Step', value: stepVal, rawValue: stepVal, icon: Network },
          { label: 'Algorithm', value: dpStore.selectedAlgorithm.toUpperCase(), icon: Target },
          { label: 'Table Size', value: tableSize, rawValue: tableSize, icon: Zap },
          { label: 'Time', value: `${executionTime.toFixed(1)}ms`, rawValue: executionTime, icon: Clock },
        ];
      }
      default:
        return [];
    }
  };

  // Read memory heap usage (Chrome-only check)
  useEffect(() => {
    const updateMemory = () => {
      const perf = typeof window !== 'undefined' ? (window.performance as ChromePerformance) : undefined;
      if (perf && perf.memory) {
        const heap = perf.memory.usedJSHeapSize;
        setHeapMemory(`${(heap / 1024 / 1024).toFixed(1)} MB`);
      } else {
        setHeapMemory('N/A');
      }
    };

    updateMemory();
    const interval = setInterval(updateMemory, 2000);
    return () => clearInterval(interval);
  }, [selectedAlgorithm]);

  const metrics = getMetricsByType();

  if (metrics.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 4-Card Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div 
              key={metric.label}
              className="p-4 rounded-xl bg-surface-card border border-border-subtle hover:border-border-hover hover:-translate-y-0.5 transition-all duration-200 cursor-default select-none flex flex-col justify-between shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-secondary text-[11px] font-bold uppercase tracking-wider">
                  {metric.label}
                </span>
                <Icon className="w-3.5 h-3.5 text-text-muted" />
              </div>
              <div className="text-2xl font-black text-white font-mono leading-none mt-1">
                {metric.rawValue !== undefined ? (
                  <span>
                    <AnimatedCounter value={metric.rawValue} />
                    {metric.label === 'Time' && <span className="text-sm font-semibold">ms</span>}
                  </span>
                ) : (
                  <AnimatedCounter value={metric.value} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Complexity Badges Row - Only for sorting */}
      {visualizerType === 'sorting' && (
        <div className="flex gap-2.5 mt-2 flex-wrap">
          <span className="px-3 py-1.5 rounded-lg bg-surface-elevated border border-border-subtle text-xs font-semibold text-text-secondary font-mono shadow-sm">
            Time: <span className="text-accent-success">{SORTING_ALGORITHMS_METADATA[selectedAlgorithm]?.timeComplexity.best} best</span> · <span className="text-accent-error">{SORTING_ALGORITHMS_METADATA[selectedAlgorithm]?.timeComplexity.worst} worst</span>
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-surface-elevated border border-border-subtle text-xs font-semibold text-text-secondary font-mono shadow-sm">
            Space: <span className="text-accent-primary">{SORTING_ALGORITHMS_METADATA[selectedAlgorithm]?.spaceComplexity}</span>
          </span>
        </div>
      )}
    </div>
  );
};

