import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Порт для разработки
    host: 'localhost', // Настройка хоста (можно изменить на 0.0.0.0 для доступа в локальной сети)
    proxy: {
      '/api': 'http://localhost:3001', // Прокси для API
      '/auth': 'http://localhost:3002', // Пример прокси для аутентификации
    },
  },
  build: {
    outDir: 'dist', // Директория для сборки
    sourcemap: true, // Включение карт кода для отладки
    minify: 'esbuild', // Использование esbuild для минификации (по умолчанию)
  },
  resolve: {
    alias: {
      '@': '/src', // Удобные пути для импорта (например, '@/components/...')
    },
  },
});