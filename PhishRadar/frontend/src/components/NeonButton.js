import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const NeonButton = ({ children, variant = 'primary', className, ...props }) => {
  const variants = {
    primary: 'bg-lime-400 text-black hover:bg-lime-300 hover:shadow-[0_0_15px_rgba(193,241,48,0.6)]',
    secondary: 'bg-transparent border border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 hover:shadow-[0_0_15px_rgba(96,250,248,0.4)]',
    danger: 'bg-red-500 text-white hover:bg-red-600 hover:shadow-[0_0_15px_rgba(255,59,48,0.6)]',
  };

  return (
    <motion.button
      className={cn(
        'font-bold px-6 py-3 rounded-md uppercase tracking-widest transition-all duration-300',
        variants[variant],
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default NeonButton;


