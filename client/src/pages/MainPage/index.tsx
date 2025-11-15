import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../services/api';
import type { IApp } from '../../types/app';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PageWrapper } from '../../components/PageWrapper';
import { AppCardSkeleton } from '../../components/AppCardSkeleton';
import { useDebounce } from '../../hooks/useDebounce';

const fetchApps = async (searchTerm: string, sortBy: string): Promise<IApp[]> => {
  const response = await apiClient.get('/apps', {
    params: { search: searchTerm || undefined, sort_by: sortBy || undefined },
  });
  return response.data;
};

const gridContainerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const gridItemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
};

const MotionLink = motion(Link);

export const MainPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: apps, isError, isFetching } = useQuery<IApp[]>({
    queryKey: ['apps', debouncedSearchTerm, sortBy],
    queryFn: () => fetchApps(debouncedSearchTerm, sortBy),
  });

  // NEW: Переменная для определения, активен ли поиск
  const isSearching = debouncedSearchTerm.length > 0;

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <h1 className="text-4xl font-bold text-white mb-4">Витрина приложений</h1>
          <p className="text-lg text-gray-400 mb-8">Откройте для себя лучшие российские приложения</p>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <input
              type="text"
              placeholder="Поиск по названию..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-1/3 bg-[#2a2a2b] text-white px-4 py-2 rounded-lg border border-transparent focus:outline-none focus:border-blue-500 transition"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSortBy('newest')}
                disabled={isSearching} // NEW: Отключаем кнопку при поиске
                className={`px-4 py-2 rounded-lg transition ${sortBy === 'newest' && !isSearching ? 'bg-blue-600 text-white' : 'bg-[#2a2a2b] text-gray-300'} ${isSearching ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
              >
                По новизне
              </button>
              <button
                onClick={() => setSortBy('popularity')}
                disabled={isSearching} // NEW: Отключаем кнопку при поиске
                className={`px-4 py-2 rounded-lg transition ${sortBy === 'popularity' && !isSearching ? 'bg-blue-600 text-white' : 'bg-[#2a2a2b] text-gray-300'} ${isSearching ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
              >
                По популярности
              </button>
            </div>
          </div>

          {/* ... Блок рендеринга скелетонов, ошибки и списка (без изменений) ... */}
          {isFetching && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {Array.from({ length: 12 }).map((_, index) => <AppCardSkeleton key={index} />)}
            </div>
          )}
          {isError && ( <div className="text-center py-16"><h2 className="text-2xl text-red-500">Ошибка</h2></div> )}
          {!isFetching && !isError && (
            <AnimatePresence>
              {apps && apps.length > 0 ? (
                <motion.div
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
                  variants={gridContainerVariants}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                >
                  {apps.map((app) => (
                    <MotionLink
                      key={app.id}
                      to={`/apps/${app.id}`}
                      variants={gridItemVariants}
                      className="group flex flex-col h-full bg-[#2a2a2b] p-4 rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all duration-300 ease-in-out hover:transform hover:-translate-y-1"
                    >
                      <div className="aspect-square w-full">
                        <motion.img
                          layoutId={`app-icon-${app.id}`}
                          src={app.icon_url}
                          alt={app.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex flex-col mt-4">
                        <h3 className="font-semibold text-base text-white truncate">{app.name}</h3>
                        <p className="text-sm text-gray-400">{app.category}</p>
                      </div>
                    </MotionLink>
                  ))}
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                  <h2 className="text-2xl text-white">Ничего не найдено</h2>
                  <p className="text-gray-400 mt-2">Попробуйте изменить поисковый запрос.</p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};