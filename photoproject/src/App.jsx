import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import Photostudios from './components/Photostudios';
import Printing from './components/Printing';
import Booking from './components/Booking';
import Home from './components/Home';
import Login from './components/Login'; // Импортируем компонент Login
import Registration from './components/Registration'; // Импортируем компонент Registration
import Footer from './components/Footer'; // Импортируем компонент Footer
import PrintingLayFlat from './components/PrintingLayFlat'; // Импортируем компонент PrintingLayFlat
import PrintingFlexBind from './components/PrintingFlexBind';
import Calendar from './components/Calendar'; // Импортируем компонент Calendar
import Reviews from './components/Reviews'; // Импорт компонента Reviews
import Admin from './components/Admin'; // Импорт компонента Admin
import EditUserGroups from './components/EditUserGroups'; // Импорт компонента EditUserGroups
import EditDatabase from './components/EditDatabase';
import EditUsers from './components/EditUsers';
import Manager from './components/Manager';
import Requests from './components/Requests';
import EditPersonalData from './components/EditPersonalData'; // Импортируем компонент EditPersonalData
import Favourites from './components/Favourites'; // Импортируем компонент Favourites
import Contacts from './components/Contacts'; // Импортируем компонент Contacts
import PrivacyPolicy from './components/PrivacyPolicy'; // Импортируем компонент PrivacyPolicy
import PhotoStudioRequests from './components/PhotoStudioRequests';
import PrintingHouseRequests from './components/PrintingHouseRequests';
import PhoneRequests from './components/PhoneRequests'; // Импортируем компонент PhoneRequests
import ForgotPassword from './components/ForgotPassword'; // Импортируем компонент ForgotPassword
import ResetPassword from './components/ResetPassword'; // Импортируем компонент ResetPassword
import CreateItems from './components/CreateItems'; // Импортируем компонент создания элементов
import PrintingDynamic from './components/PrintingDynamic'; // Новый универсальный компонент
import Payments from './components/Payments'; // Импортируем компонент Payments
import AccessControl from './components/AccessControl'; // Импортируем компонент AccessControl
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