'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X, Copy, Check, Share2, Download, QrCode, Image } from 'lucide-react';
import QRCode from 'qrcode';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  metrics: {
    comparisons?: number;
    swaps?: number;
    steps?: number;
    nodesVisited?: number;
    pathLength?: number;
    executionTime?: number;
    size?: number;
  };
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, title, metrics }) => {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href);
    }
  }, [isOpen]);

  // Generate QR Code on mount/URL change
  useEffect(() => {
    if (isOpen && qrCanvasRef.current && shareUrl) {
      QRCode.toCanvas(qrCanvasRef.current, shareUrl, {
        width: 140,
        margin: 1,
        color: {
          dark: '#ffffff',
          light: '#0c0c0c',
        },
      }, (err) => {
        if (err) console.error('QR Code render error:', err);
      });
    }
  }, [isOpen, shareUrl]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy link failed:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `ThunderStorm — ${title}`,
          text: `Check out my algorithm run for ${title} on ThunderStorm!`,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Native share failed:', err);
      }
    }
  };

  const handleDownloadSnapshot = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient (Storm theme)
    const grad = ctx.createLinearGradient(0, 0, 0, 400);
    grad.addColorStop(0, '#0c0c0c');
    grad.addColorStop(1, '#141414');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 400);

    // Decorative frame/border
    ctx.strokeStyle = 'rgba(124, 58, 237, 0.4)'; // Storm Violet border
    ctx.lineWidth = 6;
    ctx.strokeRect(10, 10, 580, 380);

    // Header logo text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px monospace';
    ctx.letterSpacing = '2px';
    ctx.fillText('⚡ THUNDERSTORM DSA VISUALIZER', 40, 50);

    // Divider line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, 70);
    ctx.lineTo(560, 70);
    ctx.stroke();

    // Title / Algorithm
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(title, 40, 120);

    // Subtitle
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '14px sans-serif';
    ctx.fillText('Algorithm Execution Summary', 40, 150);

    // Metrics Box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(40, 180, 520, 150, 12);
    ctx.fill();
    ctx.stroke();

    // Draw Metrics Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    
    let yPos = 215;
    const addMetricRow = (label: string, value: string | number) => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = 'normal 14px sans-serif';
      ctx.fillText(label, 60, yPos);
      
      ctx.fillStyle = '#7c3aed'; // Violet accent for metrics
      ctx.font = 'bold 16px monospace';
      ctx.fillText(value.toString(), 280, yPos);
      
      yPos += 30;
    };

    if (metrics.size !== undefined) addMetricRow('Dataset Size', `${metrics.size} elements`);
    if (metrics.comparisons !== undefined) addMetricRow('Comparisons', metrics.comparisons);
    if (metrics.swaps !== undefined) addMetricRow('Swaps / Swaps Count', metrics.swaps);
    if (metrics.steps !== undefined) addMetricRow('Total Operations / Steps', metrics.steps);
    if (metrics.nodesVisited !== undefined) addMetricRow('Nodes Visited', metrics.nodesVisited);
    if (metrics.pathLength !== undefined) addMetricRow('Shortest Path Length', metrics.pathLength);
    if (metrics.executionTime !== undefined) addMetricRow('Execution Time', `${metrics.executionTime.toFixed(2)} ms`);

    // Footer copyright
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.font = '10px monospace';
    ctx.fillText('reproduce at: thunderstorm.vercel.app', 40, 365);

    // Generate download link
    const link = document.createElement('a');
    link.download = `thunderstorm-${title.toLowerCase().replace(/\s+/g, '-')}-snapshot.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 select-none">
      <div 
        className="relative max-w-md w-full bg-[#0c0c0c] border border-[#2a2a2a] p-6 rounded-2xl shadow-2xl flex flex-col font-sans text-[#f0f0f0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#888888] hover:text-white cursor-pointer transition duration-150"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
          <span>⚡</span> Share Visualizer
        </h2>
        <p className="text-[#888888] text-xs mb-6">
          Share this algorithm configuration state with others.
        </p>

        {/* Sharing options flex list */}
        <div className="flex flex-col gap-4 w-full">
          {/* Link Copier Row */}
          <div className="flex items-center gap-2 w-full bg-[#141414]-card border border-[#2a2a2a] p-2.5 rounded-xl">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-transparent text-xs text-[#888888] outline-none truncate font-mono"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg bg-[#7c3aed] text-white hover:bg-[#8b5cf6] transition text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          {/* Action Row: Native Share, Download Snapshot Card */}
          <div className="flex gap-2 w-full">
            {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
              <button
                onClick={handleNativeShare}
                className="flex-1 py-2.5 rounded-xl bg-[#141414]-elevated border border-[#2a2a2a] text-white hover:border-text-secondary transition text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4" /> Share API
              </button>
            )}
            <button
              onClick={handleDownloadSnapshot}
              className="flex-1 py-2.5 rounded-xl bg-[#141414]-elevated border border-[#2a2a2a] text-white hover:border-text-secondary transition text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Snapshot Card
            </button>
          </div>

          {/* QR Code Segment */}
          <div className="flex flex-col items-center justify-center border border-[#2a2a2a]/50 bg-[#070707] p-4 rounded-2xl mt-2">
            <span className="text-[10px] font-bold text-[#555555] uppercase tracking-wider font-mono mb-3">Scan QR Code</span>
            <div className="bg-[#0c0c0c] p-2 border border-[#2a2a2a] rounded-xl flex items-center justify-center shadow-inner">
              <canvas ref={qrCanvasRef} className="w-[140px] h-[140px] block" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
