// src/components/Header.js
import React from 'react';
import './Header.css'; // Стили твоего компонента

function Header() {
  return (
    <header className="header">
      <h1>PhotoProject</h1>
      <nav>
        <ul>
          <li><a href="/">Главная</a></li>
          <li><a href="/photostudios">Фотостудии</a></li>
          <li><a href="/printing">Типография</a></li>
          <li><a href="/booking">Бронирование</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;