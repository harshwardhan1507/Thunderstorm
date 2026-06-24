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

export const CodePanel: React.FC = () => {
  const { selectedAlgorithm, language, currentStepIndex, steps } = useVisualizerStore();

  const code = snippetMap[selectedAlgorithm]?.[language] || '';
  const currentStep = steps[currentStepIndex];
  const activeLine = currentStep ? currentStep.line : -1;

  // Language display names
  const langLabelMap: Record<CodeLanguageType, string> = {
    javascript: 'JavaScript',
    java: 'Java',
    python: 'Python',
    cpp: 'C++',
  };

  const setLanguage = useVisualizerStore((state) => state.setLanguage);

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border border-border-strong overflow-hidden shadow-2xl">
      {/* Header controls */}
      <div className="flex justify-between items-center px-4 py-3 bg-background border-b border-border-strong">
        <span className="text-sm font-semibold tracking-wider text-code uppercase">Code Panel</span>
        <div className="flex gap-1 bg-card border border-border-strong rounded-lg p-0.5">
          {(['javascript', 'java', 'python', 'cpp'] as CodeLanguageType[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all duration-250 cursor-pointer ${
                language === lang
                  ? 'bg-compare text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {langLabelMap[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Code syntax container */}
      <div className="flex-1 overflow-auto text-sm p-1 font-mono">
        <SyntaxHighlighter
          language={language === 'cpp' ? 'cpp' : language}
          style={atomDark}
          customStyle={{
            margin: 0,
            background: 'transparent',
            padding: '1rem 0.5rem',
            minHeight: '100%',
          }}
          wrapLines={true}
          lineProps={(lineNum) => {
            const isHighlighted = lineNum === activeLine;
            return {
              style: {
                display: 'block',
                width: '100%',
                background: isHighlighted ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                borderLeft: isHighlighted ? '3px solid var(--color-code)' : '3px solid transparent',
                paddingLeft: '0.5rem',
                paddingRight: '0.5rem',
                transition: 'background-color 0.15s ease, border-left-color 0.15s ease',
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
