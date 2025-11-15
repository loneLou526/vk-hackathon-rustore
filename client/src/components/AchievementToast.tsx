import { motion } from 'framer-motion';
import { useEffect } from 'react';

export interface IAchievement {
  category: string;
  title: string;
  icon: string;
}

interface ToastProps {
  achievement: IAchievement;
  onClose: () => void;
}

export const AchievementToast = ({ achievement, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      layout
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="fixed top-5 right-5 z-50 flex items-center gap-4 bg-[#2a2a2b] border border-blue-500/50 shadow-lg rounded-xl p-4 text-white"
    >
      <div className="text-4xl">{achievement.icon}</div>
      <div>
        <p className="text-sm text-gray-400">Новое достижение!</p>
        <p className="font-bold">{achievement.title}</p>
      </div>
      <button onClick={onClose} className="text-2xl text-gray-500 hover:text-white">&times;</button>
    </motion.div>
  );
};