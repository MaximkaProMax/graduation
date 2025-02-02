import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <div className="logo">PhotoProject Москва</div>
      <nav className="nav">
        <ul className="desktop-menu">
          <li><Link to="/">Главная</Link></li>
          <li><Link to="/photostudios">Фотостудии</Link></li>
          <li><Link to="/printing">Типография</Link></li>
          <li><Link to="/booking">Бронирования</Link></li>
          <li><Link to="/cart">Корзина</Link></li>
          <li className="profile-menu">
            <Link to="/login">Профиль</Link>
            <ul className="dropdown">
              <li><Link to="/admin">Admin</Link></li>
              <li><Link to="/manager">Manager</Link></li>
            </ul>
          </li>
        </ul>
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>
        <ul className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          <li><Link to="/" onClick={toggleMenu}>Главная</Link></li>
          <li><Link to="/photostudios" onClick={toggleMenu}>Фотостудии</Link></li>
          <li><Link to="/printing" onClick={toggleMenu}>Типография</Link></li>
          <li><Link to="/booking" onClick={toggleMenu}>Бронирования</Link></li>
          <li><Link to="/cart" onClick={toggleMenu}>Корзина</Link></li>
          <li><Link to="/login" onClick={toggleMenu}>Профиль</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;