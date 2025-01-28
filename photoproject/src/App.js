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
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/photostudios" element={<Photostudios />} />
            <Route path="/printing" element={<Printing />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/" element={<Home />} /> {/* Главная страница */}
            <Route path="/login" element={<Login />} /> {/* Страница авторизации */}
            <Route path="/registration" element={<Registration />} /> {/* Страница регистрации */}
          </Routes>
        </main>
        <Footer /> {/* Располагаем футер здесь */}
      </div>
    </Router>
  );
}

export default App;