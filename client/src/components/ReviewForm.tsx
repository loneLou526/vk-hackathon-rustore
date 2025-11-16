import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import apiClient from '../services/api';
import { useUserStore } from '../store/userStore'; // <-- Импортируем стор

export const ReviewForm = ({ appId }: ReviewFormProps) => {
  const [author, setAuthor] = useState('');
  const [text, setText] = useState(''); // <-- Упростили, теперь только один стейт для текста
  const [rating, setRating] = useState(0);
  const queryClient = useQueryClient();
  const setUser = useUserStore((state) => state.setUser); // <-- Получаем функцию setUser


  const token = useUserStore((state) => state.token);

    const mutation = useMutation({
    mutationFn: (newReview: { text: string; rating: number }) => {
      return apiClient.post(`/apps/${appId}/reviews`, newReview);
    },
    onSuccess: async () => {
      // Обновляем список отзывов
      queryClient.invalidateQueries({ queryKey: ['reviews', String(appId)] });

      // Шлём событие о том, что отзыв отправлен
      if (token) {
        try {
          const { data } = await apiClient.post('/events', {
            type: 'REVIEW_POSTED',
            appId,
          });

          // Обновляем глобальное состояние пользователя (XP, пиксели, уровень)
          setUser(data, token);
        } catch (error) {
          console.error('Failed to track REVIEW_POSTED event:', error);
        }
      }

      // Чистим форму
      setAuthor('');
      setText('');
      setRating(0);
    },
  });


    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text && rating > 0) {
      mutation.mutate({ text, rating });
    }
  };


  return (
    <form onSubmit={handleSubmit} className="bg-[#2a2a2b] p-6 rounded-xl border border-gray-700/50 mt-10">
      <h3 className="text-xl font-bold text-white mb-4">Оставить отзыв</h3>
      {/* Звезды рейтинга */}
      <div className="flex items-center mb-4 gap-2">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;
          return (
            <button type="button" key={ratingValue} onClick={() => setRating(ratingValue)} className="text-3xl">
              <span className={ratingValue <= rating ? 'text-yellow-400' : 'text-gray-600'}>★</span>
            </button>
          );
        })}
      </div>
      <input
        type="text"
        placeholder="Ваше имя (необязательно)"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className="w-full bg-gray-700 text-white p-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        placeholder="Напишите ваш отзыв..."
        value={text} // <-- Исправлено
        onChange={(e) => setText(e.target.value)} // <-- Исправлено
        required
        className="w-full bg-gray-700 text-white p-2 rounded-md mb-4 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button type="submit" disabled={mutation.isPending} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-500 disabled:cursor-not-allowed">
        {mutation.isPending ? 'Отправка...' : 'Отправить отзыв'}
      </button>
    </form>
  );
};