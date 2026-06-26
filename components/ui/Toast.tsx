'use client';

import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../lib/context/ThemeContext';
import { themeColors } from '../../lib/theme/colors';
import { Toast as ToastType, useToast } from '../../lib/context/ToastContext';

const ToastIcon: React.FC<{ type: ToastType['type'] }> = ({ type }) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'error':
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    case 'info':
    default:
      return <Info className="w-5 h-5 text-blue-500" />;
  }
};

const ToastItem: React.FC<{ toast: ToastType }> = ({ toast }) => {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const { removeToast } = useToast();

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => removeToast(toast.id), toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, removeToast]);

  const bgColor = {
    success: theme === 'dark' ? '#1a3a1a' : '#f0fdf4',
    error: theme === 'dark' ? '#3a1a1a' : '#fef2f2',
    warning: theme === 'dark' ? '#3a2a1a' : '#fffbeb',
    info: theme === 'dark' ? '#1a2a3a' : '#f0f9ff',
  }[toast.type];

  const borderColor = {
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  }[toast.type];

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-fade-in-up transition-all duration-300"
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
        borderWidth: '1px',
      }}
    >
      <ToastIcon type={toast.type} />
      <span className="flex-1 text-sm font-medium" style={{ color: colors.text.primary }}>
        {toast.message}
      </span>
      <button
        onClick={() => removeToast(toast.id)}
        className="p-1 hover:opacity-70 transition-opacity"
        style={{ color: colors.text.secondary }}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} />
        </div>
      ))}
    </div>
  );
};
