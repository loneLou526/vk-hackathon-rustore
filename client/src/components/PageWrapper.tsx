import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};
// const pageVariants = {
//   initial: { opacity: 1, y: 0 },
//   in: { opacity: 1, y: 0 },
//   out: { opacity: 0, y: -20 },
// };

export const PageWrapper = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={{ duration: 0.5, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);