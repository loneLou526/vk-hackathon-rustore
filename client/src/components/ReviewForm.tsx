import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import apiClient from '../services/api';

interface ReviewFormProps {
  appId: number;
}

export const ReviewForm = ({ appId }: ReviewFormProps) => {
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);
  const queryClient = useQueryClient();

  // для отправки данных на сервер
  const mutation = useMutation({
    mutationFn: (newReview: { author: string; text: string; rating: number }) => {
      return apiClient.post(`/apps/${appId}/reviews`, newReview);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', String(appId)] });
      setAuthor('');
      setText('');
      setRating(0);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text && rating > 0) {
      mutation.mutate({ author: author || 'Аноним', text, rating });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#2a2a2b] p-6 rounded-xl border border-gray-700/50 mt-10">
      <h3 className="text-xl font-bold text-white mb-4">Оставить отзыв</h3>
      <div className="flex items-center mb-4 gap-2">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;
          return (
            <button
              type="button"
              key={ratingValue}
              onClick={() => setRating(ratingValue)}
              className="text-3xl"
            >
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
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
        className="w-full bg-gray-700 text-white p-2 rounded-md mb-4 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        {mutation.isPending ? 'Отправка...' : 'Отправить отзыв'}
      </button>
    </form>
  );
};