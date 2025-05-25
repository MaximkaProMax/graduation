# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

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
  - **controllers/** — обработчики логики (если выделены).
  - **models/** — модели данных (если используются ORM/ODM).
  - **uploads/** — папки для загружаемых изображений.
  - `server.js` или `index.js` — точка входа backend-сервера.

## Прочие файлы

- `README.md` — описание проекта и инструкции по запуску.
- `.gitignore` — исключения для git.
- `package.json` — зависимости и скрипты для frontend и backend.

---

Данная структура обеспечивает разделение клиентской и серверной логики, удобство поддержки и масштабирования проекта.
