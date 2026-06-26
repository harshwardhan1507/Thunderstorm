'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useTheme } from '../../lib/context/ThemeContext';
import { themeColors } from '../../lib/theme/colors';

interface CodeHighlighterProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
}

export const CodeHighlighter: React.FC<CodeHighlighterProps> = ({
  code,
  language = 'javascript',
  title,
  showLineNumbers = true,
}) => {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{
        backgroundColor: colors.bg.tertiary,
        borderColor: colors.border.primary,
      }}
    >
      {/* Header */}
      {(title || language) && (
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{
            backgroundColor: colors.bg.primary,
            borderColor: colors.border.primary,
          }}
        >
          <div>
            {title && (
              <p className="font-semibold text-sm" style={{ color: colors.text.primary }}>
                {title}
              </p>
            )}
            {language && (
              <p className="text-xs" style={{ color: colors.text.secondary }}>
                {language}
              </p>
            )}
          </div>
          <button
            onClick={copyToClipboard}
            className="p-2 rounded transition-all duration-300 hover:opacity-70"
            style={{ color: colors.text.secondary }}
            title="Copy code"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      )}

      {/* Code */}
      <pre
        className="p-4 overflow-x-auto text-sm font-mono"
        style={{
          backgroundColor: colors.bg.tertiary,
          color: colors.text.primary,
        }}
      >
        {showLineNumbers ? (
          <div className="flex">
            {/* Line Numbers */}
            <div
              className="pr-4 border-r select-none"
              style={{
                color: colors.text.tertiary,
                borderColor: colors.border.primary,
              }}
            >
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            {/* Code */}
            <div className="pl-4">
              {lines.map((line, i) => (
                <div key={i}>{highlightSyntax(line, language)}</div>
              ))}
            </div>
          </div>
        ) : (
          lines.map((line, i) => (
            <div key={i}>{highlightSyntax(line, language)}</div>
          ))
        )}
      </pre>
    </div>
  );
};

// Simple syntax highlighting
function highlightSyntax(line: string, language: string): React.ReactNode {
  // Keywords
  const keywords = ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export'];
  let result = line;

  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'g');
    result = result.replace(regex, `<span style="color: #7c3aed">${keyword}</span>`);
  });

  // Strings
  result = result.replace(/(['"`]).*?\1/g, match => `<span style="color: #22c55e">${match}</span>`);

  // Comments
  result = result.replace(/\/\/.*$/g, match => `<span style="color: #888888">${match}</span>`);

  return <span dangerouslySetInnerHTML={{ __html: result }} />;
}
