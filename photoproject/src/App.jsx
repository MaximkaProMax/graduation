import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import Photostudios from './components/pages/Photostudios';
import Printing from './components/pages/Printing';
import Booking from './components/pages/Booking';
import Home from './components/pages/Home';
import Login from './components/auth/Login'; // Импортируем компонент Login
import Registration from './components/auth/Registration'; // Импортируем компонент Registration
import Footer from './components/Footer'; // Импортируем компонент Footer
import PrintingLayFlat from './components/pages/PrintingLayFlat'; // Импортируем компонент PrintingLayFlat
import PrintingFlexBind from './components/pages/PrintingFlexBind';
import Calendar from './components/pages/Calendar'; // Импортируем компонент Calendar
import Reviews from './components/pages/Reviews'; // Импорт компонента Reviews
import Admin from './components/admin/Admin'; // Импорт компонента Admin
import EditUserGroups from './components/admin/EditUserGroups'; // Импорт компонента EditUserGroups
import EditDatabase from './components/admin/EditDatabase';
import EditUsers from './components/admin/EditUsers';
import Manager from './components/manager/Manager';
import Requests from './components/manager/Requests';
import EditPersonalData from './components/admin/EditPersonalData'; // Импортируем компонент EditPersonalData
import Favourites from './components/pages/Favourites'; // Импортируем компонент Favourites
import Contacts from './components/pages/Contacts'; // Импортируем компонент Contacts
import PrivacyPolicy from './components/pages/PrivacyPolicy'; // Импортируем компонент PrivacyPolicy
import PhotoStudioRequests from './components/manager/PhotoStudioRequests';
import PrintingHouseRequests from './components/manager/PrintingHouseRequests';
import PhoneRequests from './components/manager/PhoneRequests'; // Импортируем компонент PhoneRequests
import ForgotPassword from './components/auth/ForgotPassword'; // Импортируем компонент ForgotPassword
import ResetPassword from './components/auth/ResetPassword'; // Импортируем компонент ResetPassword
import CreateItems from './components/admin/CreateItems'; // Импортируем компонент создания элементов
import PrintingDynamic from './components/pages/PrintingDynamic'; // Новый универсальный компонент
import Payments from './components/pages/Payments'; // Импортируем компонент Payments
import AccessControl from './components/admin/AccessControl'; // Импортируем компонент AccessControl
import './App.css';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3001/api/auth/check', { withCredentials: true })
      .then(response => {
        setIsAuthenticated(response.data.isAuthenticated);
        setIsLoading(false);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Загрузка...</div>; // Показываем индикатор загрузки
  }

  return (
    <Router>
      <div className="wrapper">
        <Header />
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} /> {/* Главная страница доступна без авторизации */}
            <Route path="/photostudios" element={<Photostudios />} />
            <Route path="/printing" element={<Printing />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} /> {/* Страница авторизации */}
            <Route path="/registration" element={<Registration />} /> {/* Страница регистрации */}
            <Route path="/printing-layflat" element={<PrintingLayFlat />} /> {/* Типография LayFlat */}
            <Route path="/printing-flexbind" element={<PrintingFlexBind />} /> {/* Типография FlexBind */}
            <Route path="/calendar" element={<Calendar />} /> {/* Календарь */}
            <Route path="/reviews" element={<Reviews />} /> {/* Отзывы */}
            <Route path="/admin" element={<Admin />} /> {/* Админ */}
            <Route path="/edit-user-groups" element={<EditUserGroups />} /> {/* Редактирование групп пользователей */}
            <Route path="/admin/edit-users" element={<EditUsers />} /> {/* Редактирование пользователей */}
            <Route path="/admin/edit-database" element={<EditDatabase />} /> {/* Редактирование БД */}
            <Route path="/admin/create-items" element={<CreateItems />} /> {/* Создание элементов */}
            <Route path="/admin/access-control" element={<AccessControl />} /> {/* Управление правами */}
            <Route path="/manager" element={<Manager />} />  {/* Менеджер БД */}
            <Route path="/manager/requests" element={<Requests />} />
            <Route path="/manager/edit-personal-data" element={<EditPersonalData />} /> {/* Редактирование личных данных */}
            <Route path="/manager/photostudio-requests" element={<PhotoStudioRequests />} />
            <Route path="/manager/printinghouse-requests" element={<PrintingHouseRequests />} />
            <Route path="/manager/phone-requests" element={<PhoneRequests />} />
            <Route path="/favourites" element={<Favourites />} /> {/* Избранное */}
            <Route path="/contacts" element={<Contacts />} /> {/* Страница контактов */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} /> {/* Страница политики конфиденциальности */}
            <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Сброс пароля */}
            <Route path="/reset-password/:token" element={<ResetPassword />} /> {/* Ввод нового пароля */}
            <Route path="/printing/:id" element={<PrintingDynamic />} /> {/* Универсальная страница типографии */}
            <Route path="/payments" element={<Payments />} /> {/* Страница оплаты */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;