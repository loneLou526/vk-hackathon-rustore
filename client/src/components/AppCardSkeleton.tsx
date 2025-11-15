export const AppCardSkeleton = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      {/* Используем animate-pulse от Tailwind для эффекта мерцания */}
      <div className="w-24 h-24 rounded-md mx-auto mb-4 bg-gray-700 animate-pulse"></div>
      <div className="h-4 w-3/4 bg-gray-700 animate-pulse rounded mx-auto mb-2"></div>
      <div className="h-3 w-1/2 bg-gray-700 animate-pulse rounded mx-auto"></div>
    </div>
  );
};