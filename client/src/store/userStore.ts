import { create } from 'zustand';
import type { IApp } from '../types/app';

interface User {
  id: number;
  username: string;
  email: string;
  level: number;
  xp: number;
  pixels: number;
}

// Состояние и действия нашего хранилища
interface UserState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null, token: string | null) => void;
  logout: () => void;
  loadToken: () => void; // Функция для загрузки токена при старте приложения
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  token: null,
  setUser: (user, token) => {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('authToken');
    set({ user: null, token: null });
  },
  loadToken: () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      set({ token });
    }
  },
}));