import {useQuery} from '@tanstack/react-query';
import {Link, useParams} from 'react-router-dom';
import apiClient from '../../services/api';
import type {IApp} from '../../types/app';
import {useEffect} from 'react';
import {PageWrapper} from '../../components/PageWrapper';
import {motion} from 'framer-motion';


// Функция для получения данных ОДНОГО приложения
const fetchAppById = async (appId: string): Promise<IApp> => {
    const response = await apiClient.get(`/apps/${appId}`);
    return response.data;
};

// Функция для увеличения счетчика просмотров
const incrementViewCount = async (appId: string) => {
    // Мы не ждем ответа, просто "выстреливаем" запросом
    apiClient.post(`/apps/${appId}/view`);
}

export const AppDetailPage = () => {
    // 1. Получаем appId из URL, например, "3"
    const {appId} = useParams<{ appId: string }>();

    // 2. Используем useQuery для получения данных
    // Ключ запроса теперь динамический: ['app', appId]
    // Это гарантирует, что для разных ID будут отдельные запросы и кэш
    const {data: app, isLoading, isError} = useQuery<IApp>({
        queryKey: ['app', appId],
        queryFn: () => fetchAppById(appId!), // "!" говорит TypeScript, что appId точно будет
        enabled: !!appId, // Запрос будет выполнен только если appId существует
    });

    // 3. Увеличиваем счетчик просмотров при первом рендере страницы
    useEffect(() => {
        if (appId) {
            incrementViewCount(appId);
        }
    }, [appId]); // Этот эффект сработает один раз при изменении appId


    if (isLoading) {
        return <div className="text-white p-8">Загрузка информации о приложении...</div>;
    }

    if (isError || !app) {
        return <div className="text-red-500 p-8">Не удалось загрузить информацию о приложении.</div>;
    }

    // Превращаем строку скриншотов в массив URL'ов

    return (
        <PageWrapper>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-[#1c1c1d] min-h-screen text-white p-4 md:p-8">
                    {/* Кнопка "Назад" */}
                    <Link to="/" className="text-blue-500 hover:underline mb-8 inline-block text-lg">&larr; Назад к
                        списку</Link>

                    {/* Блок загрузки */}
                    {isLoading && <div className="text-white">Загрузка...</div>}

                    {/* Блок с ошибкой */}
                    {isError && <div className="text-red-500">Ошибка.</div>}

                    {/* Контент страницы */}
                    {app && (
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Левая колонка: иконка */}
                            <div className="flex-shrink-0 w-full md:w-48">
                                <motion.img
                                    layoutId={`app-icon-${app.id}`}
                                    src={app.icon_url}
                                    alt={app.name}
                                    className="w-full aspect-square object-cover rounded-3xl"
                                />
                            </div>

                            {/* Правая колонка: информация */}
                            <div className="flex-grow">
                                <h1 className="text-5xl font-bold">{app.name}</h1>
                                <p className="text-2xl text-gray-400 mt-1">{app.developer}</p>

                                <div className="flex items-center gap-4 my-6">
                                    <div className="bg-gray-700 px-3 py-1 rounded-md text-sm">{app.category}</div>
                                    <div
                                        className="border border-gray-600 px-3 py-1 rounded-md text-sm">Возраст: {app.age_rating}</div>
                                </div>

                                <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4 mt-10">Описание</h2>
                                <p className="text-gray-300 whitespace-pre-line text-lg">{app.description}</p>

                                <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4 mt-10">Скриншоты</h2>
                                <div className="flex overflow-x-auto gap-4 p-1">
                                    {app.screenshots.split(',').map((url, index) => (
                                        <img
                                            key={index}
                                            src={url}
                                            alt={`Скриншот ${index + 1}`}
                                            className="h-56 rounded-lg object-cover"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PageWrapper>
    );
};