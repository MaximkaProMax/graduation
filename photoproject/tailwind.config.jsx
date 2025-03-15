/** @type {import('tailwindcss').Config} */
export default {
    content: [
      './index.html',
      './src/**/*.{js,jsx,ts,tsx}', // Пути к файлам с HTML/JSX
    ],
    theme: {
      extend: {}, // Добавление кастомных настроек, если нужно
    },
    plugins: [], // Подключение дополнительных плагинов
  };  