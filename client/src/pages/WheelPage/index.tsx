import { PageWrapper } from '../../components/PageWrapper';
import { useUserStore } from '../../store/userStore';
import { useMutation } from '@tanstack/react-query';
import apiClient from '../../services/api';
import { useState } from 'react';

const spinWheel = async () => {
    const { data } = await apiClient.post('/wheel/spin');
    return data;
};

export const WheelPage = () => {
    const { user, setUser } = useUserStore();
    const [prize, setPrize] = useState<any>(null);

    const mutation = useMutation({
        mutationFn: spinWheel,
        onSuccess: (data) => {
            setPrize(data.prize);
            setUser(data.updated_user, localStorage.getItem('authToken'));
        },
        onError: (error: any) => {
            alert(error.response?.data?.detail || "Произошла ошибка");
        }
    });

    const handleSpin = () => {
        setPrize(null);
        mutation.mutate();
    };

    if (!user) {
        return <div className="p-8 text-white">Для доступа к Колесу Удачи необходимо войти.</div>;
    }

    return (
        <PageWrapper>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white text-center">
                <h1 className="text-5xl font-bold">Колесо Удачи</h1>
                <p className="text-xl text-gray-400 mt-4">Испытайте свою удачу и выиграйте ценные призы!</p>

                <div className="my-12">
                    <div className="w-96 h-96 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <div className="w-80 h-80 rounded-full bg-[#1c1c1d] flex items-center justify-center">
                            {mutation.isPending ? (
                                <span className="text-3xl font-bold animate-spin">...</span>
                            ) : prize ? (
                                <div className='text-center'>
                                    <p className='text-gray-400'>Вы выиграли:</p>
                                    <p className='text-2xl font-bold text-yellow-400'>{prize.value} {prize.type === 'promo' ? '' : prize.type}</p>
                                </div>
                            ) : (
                                <span className="text-3xl font-bold">?</span>
                            )}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSpin}
                    disabled={mutation.isPending || user.pixels < 100}
                    className="bg-yellow-400 text-black font-bold px-12 py-4 rounded-xl text-2xl hover:bg-yellow-500 transition transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    {mutation.isPending ? "Вращается..." : "Вращать!"}
                </button>
                <p className="text-gray-500 mt-4">Стоимость: 100 Пикселей. Ваш баланс: {user.pixels}</p>
            </div>
        </PageWrapper>
    );
};