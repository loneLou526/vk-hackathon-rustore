import { PageWrapper } from '../../components/PageWrapper';
import { useUserStore } from '../../store/userStore';

// Заглушка для списка заданий. В реальном проекте это бы приходило с бэкенда.
const quests = [
    { title: "Осмотр окрестностей", description: "Посетить 3 страницы приложений", progress: 0, goal: 3, reward: 50 },
    { title: "Глас народа", description: "Оставить 1 отзыв", progress: 0, goal: 1, reward: 100 },
    { title: "Коллекционер", description: "Посетить 50 уникальных приложений", progress: 0, goal: 50, reward: 500 },
    { title: "Критик", description: "Написать 25 отзывов", progress: 0, goal: 25, reward: 1000 },
];

export const ProfilePage = () => {
    const { user } = useUserStore();

    if (!user) {
        return <div className="p-8 text-white">Загрузка профиля...</div>; // Или редирект на логин
    }

    const userInitial = user.username[0].toUpperCase();
    const xpForNextLevel = user.level * 100;
    const xpPercentage = Math.min((user.xp / xpForNextLevel) * 100, 100);

    return (
        <PageWrapper>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
                {/* Шапка профиля */}
                <div className="flex items-center gap-6 bg-[#2a2a2b] p-6 rounded-2xl">
                    <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-5xl font-bold flex-shrink-0">
                        {userInitial}
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold">{user.username}</h1>
                        <p className="text-lg text-yellow-400 font-bold">{user.pixels} Пикселей</p>
                    </div>
                </div>

                {/* Прогресс уровня */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">Прогресс Исследователя</h2>
                    <div className="bg-[#2a2a2b] p-6 rounded-2xl">
                        <div className="flex justify-between font-bold mb-2">
                            <span>Уровень {user.level}</span>
                            <span>{user.xp} / {xpForNextLevel} XP</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${xpPercentage}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* Задания Экспедиции */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">Задания Экспедиции</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {quests.map(quest => (
                            <div key={quest.title} className="bg-[#2a2a2b] p-6 rounded-2xl">
                                <h3 className="text-lg font-bold">{quest.title}</h3>
                                <p className="text-sm text-gray-400">{quest.description}</p>
                                <div className="mt-4">
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        {/* Здесь будет динамический прогресс */}
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                                    </div>
                                    <p className="text-right text-xs text-gray-400 mt-1">Награда: {quest.reward} Пикселей</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};