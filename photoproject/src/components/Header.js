import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="logo">PhotoProject Москва</div>
      <nav className="nav">
        <ul>
          <li><Link to="/">Главная</Link></li>
          <li><Link to="/photostudios">Фотостудии</Link></li>
          <li><Link to="/printing">Типография</Link></li>
          <li><Link to="/booking">Бронирования</Link></li>
          <li><Link to="/login">Профиль</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;