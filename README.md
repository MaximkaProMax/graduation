# Структура проекта PhotoProject

Проект PhotoProject реализован с использованием фреймворка React для frontend и Node.js/Express для backend. Ниже приведено описание основных папок и файлов проекта.

## Основные папки и файлы

- **photoproject/** — корневая папка frontend-приложения на React.
  - **src/** — исходный код клиентской части.
    - **components/** — React-компоненты, реализующие страницы и элементы интерфейса:
      - `Header.jsx`, `Footer.jsx` — шапка и подвал сайта.
      - `Home.jsx` — главная страница.
      - `Photostudios.jsx`, `Printing.jsx` — страницы фотостудий и типографий.
      - `Favourites.jsx` — страница избранного.
      - `PrintingLayFlat.jsx`, `PrintingFlexBind.jsx`, `PrintingDynamic.jsx` — карточки и динамические страницы типографий.
      - `Booking.jsx`, `Calendar.jsx` — бронирование и календарь.
      - `Login.jsx`, `Registration.jsx`, `ForgotPassword.jsx`, `ResetPassword.jsx` — страницы аутентификации.
      - `Admin.jsx`, `Manager.jsx`, `EditDatabase.jsx`, `EditUsers.jsx`, `EditUserGroups.jsx`, `AccessControl.jsx` — административные панели.
      - `Requests.jsx`, `PhotoStudioRequests.jsx`, `PrintingHouseRequests.jsx`, `PhoneRequests.jsx` — управление заявками.
      - `CreateItems.jsx` — добавление новых элементов в базу.
      - `Contacts.jsx`, `PrivacyPolicy.jsx`, `Reviews.jsx` — информационные страницы.
    - **assets/** — изображения и статические ресурсы.
      - **images/** — изображения для фотостудий, типографий, иконки и т.д.
    - **styles/** — CSS-файлы для стилизации компонентов.
    - `App.jsx` — основной компонент приложения, содержит маршрутизацию.
    - `index.jsx` — точка входа приложения.
  - **public/** — статические файлы (если используется).
  - `vite.config.js` — конфигурация Vite для сборки проекта.
  - `index.html` — шаблон HTML для приложения.
  - `App.css`, `index.css` — глобальные стили.

- **serverside/** — серверная часть на Node.js/Express.
  - **routes/** — маршруты API для работы с фотостудиями, типографиями, бронированиями, пользователями и т.д.
    - `photostudiosRoutes.js`, `printingRoutes.js` и др.
  - **models/** — модели данных (если используются ORM/ODM).
  - `server.js` или `index.js` — точка входа backend-сервера.

## Прочие файлы

- `README.md` — описание проекта и инструкции по запуску.
- `.gitignore` — исключения для git.
- `package.json` — зависимости и скрипты для frontend и backend.

---

Данная структура обеспечивает разделение клиентской и серверной логики, удобство поддержки и масштабирования проекта.
