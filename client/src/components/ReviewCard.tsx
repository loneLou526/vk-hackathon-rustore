import { motion } from 'framer-motion';

export interface IReview {
  id: number;
  author: string;
  text: string;
  rating: number;
  created_at: string;
}

// Для отображения звезд
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-600'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.96h4.167c.969 0 1.371 1.24.588 1.81l-3.37 2.446 1.286 3.96c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.37 2.446c-.784.57-1.84-.197-1.54-1.118l1.286-3.96-3.37-2.446c-.783-.57-.38-1.81.588-1.81h4.167l1.286-3.96z" />
        </svg>
      ))}
    </div>
  );
};

export const ReviewCard = ({ review }: { review: IReview }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#2a2a2b] p-4 rounded-xl border border-gray-700/50"
    >
      <div className="flex justify-between items-center mb-2">
        <p className="font-bold text-white">{review.author}</p>
        <StarRating rating={review.rating} />
      </div>
      <p className="text-gray-300">{review.text}</p>
      <p className="text-xs text-gray-500 mt-3 text-right">
        {new Date(review.created_at).toLocaleDateString()}
      </p>
    </motion.div>
  );
};