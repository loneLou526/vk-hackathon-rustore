# --- build-стейдж: собираем React (Vite) ---
FROM node:20-alpine AS build

WORKDIR /app

# Копируем package.json + lock-файлы
COPY package*.json ./
COPY vite.config.* tsconfig.* eslint.config.js ./ 2>/dev/null || true

RUN npm install

# Копируем исходники
COPY . .

# Переменная на всякий случай (по умолчанию используем /api/v1)
ARG VITE_API_BASE_URL=/api/v1
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

# --- runtime-стейдж: nginx, отдаём статику + проксируем API ---
FROM nginx:alpine

# Копируем собранный фронт
COPY --from=build /app/dist /usr/share/nginx/html

# Наш конфиг nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
