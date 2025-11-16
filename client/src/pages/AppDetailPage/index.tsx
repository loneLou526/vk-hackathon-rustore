import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import apiClient from '../../services/api';
import type { IApp } from '../../types/app';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageWrapper } from '../../components/PageWrapper';
import { trackAppView } from '../../services/achievementService';
import { AchievementToast, type IAchievement } from '../../components/AchievementToast';
import { ReviewCard, type IReview } from '../../components/ReviewCard';
import { ReviewForm } from '../../components/ReviewForm';
import { useUserStore } from '../../store/userStore';

const fetchAppById = async (appId: string): Promise<IApp> => {
  const response = await apiClient.get(`/apps/${appId}`);
  return response.data;
};

const fetchReviews = async (appId: string): Promise<IReview[]> => {
  const response = await apiClient.get(`/apps/${appId}/reviews`);
  return response.data;
};

const incrementViewCount = (appId: string) => {
    apiClient.post(`/apps/${appId}/view`);
}

export const AppDetailPage = () => {
  const { appId } = useParams<{ appId: string }>();
  const [newAchievement, setNewAchievement] = useState<IAchievement | null>(null);
  const setUser = useUserStore((state) => state.setUser);

  const { data: app, isLoading: isAppLoading, isError: isAppError } = useQuery<IApp>({
    queryKey: ['app', appId],
    queryFn: () => fetchAppById(appId!),
    enabled: !!appId,
  });

  const { data: reviews, isLoading: areReviewsLoading } = useQuery<IReview[]>({
    queryKey: ['reviews', appId],
    queryFn: () => fetchReviews(appId!),
    enabled: !!appId,
  });

  const token = useUserStore((state) => state.token);

    useEffect(() => {
    if (!appId || !app) return;

    // 1) Локально: увеличиваем счётчик просмотров для приложения
    incrementViewCount(appId);

    // 2) Локально: считаем ачивки за просмотры
    const achievement = trackAppView(app.id, app.category);
    if (achievement) {
      setNewAchievement(achievement);
    }

    // 3) На бэкенд шлём событие только если пользователь залогинен
    if (!token) return;

    const sendEvent = async () => {
      try {
        const { data } = await apiClient.post('/events', {
          type: 'APP_VIEWED',
          appId: app.id,
        });

        // data — это обновлённый пользователь (XP, пиксели, уровень)
        setUser(data, token);
      } catch (error) {
        console.error('Failed to track APP_VIEWED event:', error);
      }
    };

    sendEvent();
  }, [appId, app, token, setUser]);


  const screenshots = app?.screenshots.split(',') || [];

  return (
    <PageWrapper>
      <AnimatePresence>
        {newAchievement && <AchievementToast achievement={newAchievement} onClose={() => setNewAchievement(null)} />}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#1c1c1d] min-h-screen text-white py-8">
              <Link to="/" className="text-blue-500 hover:underline mb-8 inline-block text-lg">&larr; Назад к списку</Link>

              {isAppLoading && <div className="text-white">Загрузка...</div>}
              {isAppError && <div className="text-red-500">Ошибка.</div>}

              {app && (
                  <div>
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-shrink-0 w-full md:w-48">
                            <motion.img layoutId={`app-icon-${app.id}`} src={app.icon_url} alt={app.name} className="w-full aspect-square object-cover rounded-3xl"/>
                        </div>
                        <div className="flex-grow">
                            <h1 className="text-5xl font-bold">{app.name}</h1>
                            <p className="text-2xl text-gray-400 mt-1">{app.developer}</p>
                            <div className="flex items-center gap-4 my-6">
                                <div className="bg-gray-700 px-3 py-1 rounded-md text-sm">{app.category}</div>
                                <div className="border border-gray-600 px-3 py-1 rounded-md text-sm">Возраст: {app.age_rating}</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10">
                        <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">Описание</h2>
                        <p className="text-gray-300 whitespace-pre-line text-lg">{app.description}</p>
                    </div>

                    <div className="mt-10">
                        <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">Скриншоты</h2>
                        <div className="flex overflow-x-auto gap-4 p-1">
                            {screenshots.map((url, index) => <img key={index} src={url} alt={`Скриншот ${index + 1}`} className="h-56 rounded-lg object-cover"/>)}
                        </div>
                    </div>

                    <div className="mt-10">
                        <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">Отзывы</h2>
                        <ReviewForm appId={app.id} />

                        <div className="mt-6 space-y-4">
                            {areReviewsLoading && <p>Загрузка отзывов...</p>}
                            {reviews && reviews.length > 0 ? (
                                reviews.map(review => <ReviewCard key={review.id} review={review} />)
                            ) : (
                                !areReviewsLoading && <p className="text-gray-500">Отзывов пока нет. Станьте первым!</p>
                            )}
                        </div>
                    </div>
                  </div>
              )}
          </div>
      </div>
    </PageWrapper>
  );
};