'use client';

import React from 'react';
import { motion, LayoutGroup } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <LayoutGroup>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="flex-1 flex flex-col w-full"
      >
        {children}
      </motion.div>
    </LayoutGroup>
  );
}
