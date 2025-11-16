import { PageWrapper } from '../../components/PageWrapper';
import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '../../services/api';
import type { IStoreItem } from '../../types/store';
import { useUserStore } from '../../store/userStore';

const fetchStoreItems = async (): Promise<IStoreItem[]> => {
  const { data } = await apiClient.get('/store/items');
  return data;
};

export const StorePage = () => {
  const { user, token, setUser } = useUserStore();

  const {
    data: items = [],
    isLoading,
    isError,
  } = useQuery<IStoreItem[]>({
    queryKey: ['store-items'],
    queryFn: fetchStoreItems,
  });

  const buyMutation = useMutation({
    mutationFn: async (itemId: number) => {
      const { data } = await apiClient.post('/store/buy', { itemId });
      return data;
    },
    onSuccess: (data: any) => {
      if (data?.updated_user && token) {
        setUser(data.updated_user, token);
      }
      if (data?.item?.name) {
        alert(`Покупка оформлена: ${data.item.name}`);
      } else {
        alert('Покупка успешно оформлена!');
      }
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.detail ||
        'Не удалось совершить покупку. Попробуйте ещё раз.';
      alert(message);
    },
  });

  if (!user) {
    return (
      <PageWrapper>
        <div className="p-8 text-white">
          Магазин доступен только после авторизации. Пожалуйста, войдите в аккаунт.
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Магазин наград</h1>
        <p className="text-gray-400 mb-6">
          Обменивайте заработанные Пиксели на призы от VK и партнёров.
        </p>

        <div className="mb-6 text-lg">
          <span className="text-gray-400 mr-2">Ваш баланс:</span>
          <span className="font-semibold text-yellow-300">
            {user.pixels} Пикселей
          </span>
        </div>

        {isLoading && <div>Загрузка магазина...</div>}
        {isError && (
          <div>Не удалось загрузить магазин. Попробуйте обновить страницу.</div>
        )}

        {!isLoading && !isError && items.length === 0 && (
          <div>В магазине пока нет доступных наград.</div>
        )}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-gray-800/70 border border-gray-700 rounded-2xl p-6 flex flex-col justify-between shadow-lg"
            >
              <div>
                <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                <p className="text-gray-400 mb-4">{item.description}</p>

                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-32 object-cover rounded-xl mb-4"
                  />
                )}
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-lg font-semibold text-yellow-300">
                  {item.price} Пикселей
                </div>
                <button
                  onClick={() => buyMutation.mutate(item.id)}
                  disabled={buyMutation.isPending || user.pixels < item.price}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-blue-700 transition"
                >
                  {user.pixels < item.price
                    ? 'Недостаточно Пикселей'
                    : 'Купить'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};
