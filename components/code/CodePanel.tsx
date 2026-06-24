'use client';

import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useVisualizerStore, SortingAlgorithmType, CodeLanguageType } from '../../store/visualizerStore';
import { bubbleSnippets } from '../../lib/snippets/sorting/bubble';
import { quickSnippets } from '../../lib/snippets/sorting/quick';
import { mergeSnippets } from '../../lib/snippets/sorting/merge';
import { heapSnippets } from '../../lib/snippets/sorting/heap';

const snippetMap: Record<SortingAlgorithmType, Record<CodeLanguageType, string>> = {
  bubble: bubbleSnippets,
  quick: quickSnippets,
  merge: mergeSnippets,
  heap: heapSnippets,
};

interface CodePanelProps {
  code?: string;
  language?: CodeLanguageType;
  activeLine?: number;
  setLanguage?: (lang: CodeLanguageType) => void;
  algorithm?: string;
  visualizerType?: 'sorting' | 'graph' | 'pathfinding' | 'tree' | 'dp';
}

export const CodePanel: React.FC<CodePanelProps> = ({
  code: propsCode,
  language: propsLanguage,
  activeLine: propsActiveLine,
  setLanguage: propsSetLanguage,
}) => {
  const sortingStore = useVisualizerStore();

  const language = propsLanguage ?? sortingStore.language;
  const setLanguage = propsSetLanguage ?? sortingStore.setLanguage;
  const currentStep = sortingStore.steps[sortingStore.currentStepIndex];
  const activeLine = propsActiveLine ?? (currentStep ? currentStep.line : -1);
  const code = propsCode ?? (snippetMap[sortingStore.selectedAlgorithm]?.[language] || '');

  // Language display names
  const langLabelMap: Record<CodeLanguageType, string> = {
    javascript: 'JavaScript',
    java: 'Java',
    python: 'Python',
    cpp: 'C++',
  };

  return (
    <div className="flex flex-col h-full bg-surface w-full min-w-0">
      {/* Header controls */}
      <div className="flex justify-between items-center px-4 py-3 bg-surface-card/90 backdrop-blur-md border-b border-border-subtle">
        <span className="text-xs font-bold uppercase tracking-wider text-text-secondary font-mono">Code Panel</span>
        <div className="flex gap-1.5 p-0.5">
          {(['javascript', 'java', 'python', 'cpp'] as CodeLanguageType[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-3 py-1 rounded text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                language === lang
                  ? 'bg-accent-primary text-white shadow-sm'
                  : 'text-text-secondary hover:text-white hover:bg-surface-elevated'
              }`}
            >
              {langLabelMap[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Code syntax container */}
      <div className="flex-1 overflow-auto text-sm font-mono">
        <SyntaxHighlighter
          language={language === 'cpp' ? 'cpp' : language}
          style={atomDark}
          customStyle={{
            margin: 0,
            background: 'transparent',
            padding: '1rem 0',
            minHeight: '100%',
          }}
          wrapLines={true}
          lineProps={(lineNum) => {
            const isHighlighted = lineNum === activeLine;
            return {
              className: isHighlighted ? 'active-line' : '',
              style: {
                display: 'block',
                width: '100%',
                transition: 'background-color 0.15s ease, border-left-color 0.15s ease',
                paddingLeft: '1.25rem',
                paddingRight: '1.25rem',
                backgroundColor: isHighlighted ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                borderLeft: isHighlighted ? '3px solid #3B82F6' : '3px solid transparent',
              },
            };
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};
