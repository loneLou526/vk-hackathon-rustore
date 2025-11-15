import axios from 'axios';

// Создаем экземпляр Axios с базовым URL нашего бэкенда
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1', // Адрес нашего API
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;