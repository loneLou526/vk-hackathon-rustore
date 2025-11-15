import {useQuery} from '@tanstack/react-query';
import apiClient from '../../services/api';
import type {IApp} from '../../types/app';
import {Link} from 'react-router-dom';
import {AppCardSkeleton} from '../../components/AppCardSkeleton';
import {PageWrapper} from '../../components/PageWrapper';
import {motion} from 'framer-motion';

// Функция для получения данных
const fetchApps = async (): Promise<IApp[]> => {
    const response = await apiClient.get('/apps');
    return response.data;
};

export const MainPage = () => {
    const {data: apps, isLoading, isError} = useQuery<IApp[]>({
        queryKey: ['apps'],
        queryFn: fetchApps,
    });

    if (isLoading) {
        return (
            <PageWrapper>
                <div className="p-8">
                    <h1 className="text-4xl font-bold text-white mb-8">Витрина приложений</h1>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {Array.from({length: 6}).map((_, index) => (
                            <AppCardSkeleton key={index}/>
                        ))}
                    </div>
                </div>
            </PageWrapper>
        );
    }

    if (isError) {
        return <div className="text-red-500">Ошибка при загрузке данных</div>;
    }

    return (
        <PageWrapper>
            {/* Контейнер, который центрирует контент и ограничивает его ширину */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="p-8">
                    <h1 className="text-4xl font-bold text-white mb-8">Витрина приложений</h1>

                    {/* Блок загрузки со скелетами */}
                    {isLoading && (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {Array.from({length: 12}).map((_, index) => (
                                <AppCardSkeleton key={index}/>
                            ))}
                        </div>
                    )}

                    {/* Блок с ошибкой */}
                    {isError && (
                        <div className="text-red-500">Ошибка при загрузке данных</div>
                    )}

                    {/* Сетка с карточками */}
                    {!isLoading && !isError && (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {apps?.map((app) => (
                                <Link
                                    to={`/apps/${app.id}`}
                                    key={app.id}
                                    className="group flex flex-col bg-[#2a2a2b] p-4 rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all duration-300 ease-in-out hover:transform hover:-translate-y-1"
                                >
                                    {/* Контейнер для иконки с сохранением пропорций */}
                                    <div className="aspect-square w-full">
                                        <motion.img
                                            layoutId={`app-icon-${app.id}`}
                                            src={app.icon_url}
                                            alt={app.name}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    </div>
                                    {/* Текстовый блок */}
                                    <div className="flex flex-col mt-4">
                                        <h3 className="font-semibold text-base text-white truncate">{app.name}</h3>
                                        <p className="text-sm text-gray-400">{app.category}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PageWrapper>
    );
};