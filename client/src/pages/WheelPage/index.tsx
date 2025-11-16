import { PageWrapper } from '../../components/PageWrapper';
import { useUserStore } from '../../store/userStore';

export const WheelPage = () => {
    const { user } = useUserStore();

    if (!user) {
        return <div className="p-8 text-white">Для доступа к Колесу Удачи необходимо войти.</div>;
    }

    const handleSpin = () => {
        // Здесь будет логика запроса на бэкенд
        alert('Вращаем колесо! (логика в разработке)');
    };

    return (
        <PageWrapper>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white text-center">
                <h1 className="text-5xl font-bold">Колесо Удачи</h1>
                <p className="text-xl text-gray-400 mt-4">Испытайте свою удачу и выиграйте ценные призы от VK и партнеров!</p>

                <div className="my-12">
                    {/* Заглушка для колеса */}
                    <div className="w-96 h-96 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <div className="w-80 h-80 rounded-full bg-[#1c1c1d] flex items-center justify-center">
                            <span className="text-3xl font-bold">?</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSpin}
                    className="bg-yellow-400 text-black font-bold px-12 py-4 rounded-xl text-2xl hover:bg-yellow-500 transition transform hover:scale-105"
                >
                    Вращать!
                </button>
                <p className="text-gray-500 mt-4">Стоимость: 100 Пикселей</p>
            </div>
        </PageWrapper>
    );
};