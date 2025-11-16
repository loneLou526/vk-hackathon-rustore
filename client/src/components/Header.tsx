import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { motion, AnimatePresence } from 'framer-motion';

export const Header = () => {
  const { user, logout } = useUserStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const userInitial = user?.username ? user.username[0].toUpperCase() : '?';
  const xpForNextLevel = user ? user.level * 100 : 100;
  const xpPercentage = user ? Math.min((user.xp / xpForNextLevel) * 100, 100) : 0;

  return (
    <header className="h-20 flex-shrink-0 bg-[#2a2a2b]/80 backdrop-blur-sm border-b border-gray-700/50 flex items-center justify-end px-8 sticky top-0 z-40">
      {user ? (
        <div className="relative" ref={menuRef}>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-yellow-400 font-bold">
              <span className="text-2xl"></span>
              <span>{user.pixels}</span>
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold text-white transition-transform duration-200 hover:scale-105"
            >
              {userInitial}
            </button>
          </div>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-16 right-0 w-72 bg-[#232324] border border-gray-700 rounded-xl shadow-2xl p-4"
              >
                <p className="font-bold text-lg text-white truncate">{user.username}</p>
                <p className="text-sm text-gray-400 mb-4">{user.email}</p>

                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Уровень {user.level}</span>
                    <span>{user.xp} / {xpForNextLevel} XP</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${xpPercentage}%` }}></div>
                  </div>
                </div>

                <div className="border-t border-gray-700 my-2" />

                <Link to="/profile" className="block w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700/50 rounded-md transition mb-1">
                  Мой профиль
                </Link>

                <div className="border-t border-gray-700 my-2" />

                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2 text-red-500 hover:bg-red-500/10 rounded-md transition"
                >
                  Выйти
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link to="/login" className="px-4 py-2 text-gray-300 font-medium hover:text-white transition">
            Войти
          </Link>
          <Link to="/register" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
            Регистрация
          </Link>
        </div>
      )}
    </header>
  );
};