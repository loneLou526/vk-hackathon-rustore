import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../services/api';
import { useUserStore } from '../../store/userStore';

const loginUser = async (formData: FormData) => {
    const { data } = await apiClient.post('/auth/login', formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    return data;
};

export const LoginPage = () => {
    const navigate = useNavigate();
    const setUser = useUserStore((state) => state.setUser);
    const [error, setError] = useState<string | null>(null);

    const mutation = useMutation({
        mutationFn: loginUser,
        onSuccess: async (data) => {
            // Получаем данные пользователя с помощью нового токена
            const userResponse = await apiClient.get('/users/me', {
                headers: { Authorization: `Bearer ${data.access_token}` }
            });
            setUser(userResponse.data, data.access_token);
            navigate('/'); // Перебрасываем на главную
        },
        onError: () => {
            setError('Неверное имя пользователя или пароль.');
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const formData = new FormData(e.currentTarget);
        mutation.mutate(formData);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#1c1c1d]">
            <div className="w-full max-w-md p-8 space-y-8 bg-[#2a2a2b] rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-center text-white">Вход в RuStore</h1>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <input name="username" type="text" required placeholder="Имя пользователя" className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input name="password" type="password" required placeholder="Пароль" className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit" disabled={mutation.isPending} className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition disabled:bg-gray-500">
                        {mutation.isPending ? 'Вход...' : 'Войти'}
                    </button>
                </form>
                <p className="text-sm text-center text-gray-400">
                    Нет аккаунта?{' '}
                    <Link to="/register" className="font-medium text-blue-500 hover:underline">Зарегистрироваться</Link>
                </p>
            </div>
        </div>
    );
};