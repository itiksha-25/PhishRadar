import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const GlassCard = ({ children, className, hover = true, ...props }) => {
  return (
    <motion.div
      className={cn(
        'glass-card rounded-xl p-6',
        hover && 'hover:border-lime-400/50 hover:shadow-[0_0_20px_rgba(193,241,48,0.2)] transition-all duration-300',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;


