import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../services/api';

const registerUser = async (userData: any) => {
    const { data } = await apiClient.post('/auth/register', userData);
    return data;
};

export const RegisterPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const mutation = useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            navigate('/login'); // После успешной регистрации перебрасываем на страницу входа
        },
        onError: (err: any) => {
            setError(err.response?.data?.detail || 'Произошла ошибка при регистрации.');
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const formData = new FormData(e.currentTarget);
        const userData = Object.fromEntries(formData.entries());
        mutation.mutate(userData);
    };

    return (
         <div className="flex items-center justify-center min-h-screen bg-[#1c1c1d]">
            <div className="w-full max-w-md p-8 space-y-8 bg-[#2a2a2b] rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-center text-white">Регистрация в RuStore</h1>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <input name="username" type="text" required placeholder="Имя пользователя" className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input name="email" type="email" required placeholder="Email" className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input name="password" type="password" required minLength={8} placeholder="Пароль (мин. 8 символов)" className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit" disabled={mutation.isPending} className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition disabled:bg-gray-500">
                         {mutation.isPending ? 'Регистрация...' : 'Создать аккаунт'}
                    </button>
                </form>
                 <p className="text-sm text-center text-gray-400">
                    Уже есть аккаунт?{' '}
                    <Link to="/login" className="font-medium text-blue-500 hover:underline">Войти</Link>
                </p>
            </div>
        </div>
    );
};