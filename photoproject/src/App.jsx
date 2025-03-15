import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import Cart from './components/Cart'; // Импорт компонента Cart
import Payment from './components/Payment'; // Импорт компонента Payment
import Reviews from './components/Reviews'; // Импорт компонента Reviews
import Admin from './components/Admin'; // Импорт компонента Admin
import EditUserGroups from './components/EditUserGroups'; // Импорт компонента EditUserGroups
import EditDatabase from './components/EditDatabase';
import EditUsers from './components/EditUsers';
import Manager from './components/Manager';
import Requests from './components/Requests';
import PersonalData from './components/PersonalData';
import EditPersonalData from './components/EditPersonalData'; // Импортируем компонент EditPersonalData
import './App.css';
import './index.css';

function App() {
  return (
    <Router>
      <div className="wrapper">
        <Header />
        <main className="content">
          <Routes>
            <Route path="/photostudios" element={<Photostudios />} />
            <Route path="/printing" element={<Printing />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/" element={<Home />} /> {/* Главная страница */}
            <Route path="/login" element={<Login />} /> {/* Страница авторизации */}
            <Route path="/registration" element={<Registration />} /> {/* Страница регистрации */}
            <Route path="/printing-layflat" element={<PrintingLayFlat />} /> {/* Типография LayFlat */}
            <Route path="/printing-flexbind" element={<PrintingFlexBind />} /> {/* Типография FlexBind */}
            <Route path="/calendar" element={<Calendar />} /> {/* Календарь */}
            <Route path="/cart" element={<Cart />} /> {/* Корзина */}
            <Route path="/payment" element={<Payment />} /> {/* Оплата */}
            <Route path="/reviews" element={<Reviews />} /> {/* Отзывы */}
            <Route path="/admin" element={<Admin />} /> {/* Админ */}
            <Route path="/edit-user-groups" element={<EditUserGroups />} /> {/* Редактирование групп пользователей */}
            <Route path="/admin/edit-users" element={<EditUsers />} /> {/* Редактирование пользователей */}
            <Route path="/admin/edit-database" element={<EditDatabase />} /> {/* Редактирование БД */}
            <Route path="/manager" element={<Manager />} />  {/* Менеджер БД */}
            <Route path="/manager/requests" element={<Requests />} />
            <Route path="/manager/personal-data" element={<PersonalData />} />
            <Route path="/manager/edit-personal-data" element={<EditPersonalData />} /> {/* Редактирование личных данных */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;