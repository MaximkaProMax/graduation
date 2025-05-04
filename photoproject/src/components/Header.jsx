import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import axios from 'axios';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userLogin, setUserLogin] = useState(null);

  useEffect(() => {
    const fetchUser = () => {
      axios.get('http://localhost:3001/api/users/user', { withCredentials: true })
        .then(response => setUserLogin(response.data.login))
        .catch(() => setUserLogin(null));
    };

    fetchUser();

    const handleAuthChange = () => {
      fetchUser(); // Обновляем данные пользователя при изменении авторизации
    };

    window.addEventListener('authChange', handleAuthChange);
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    axios.post('http://localhost:3001/api/users/logout', {}, { withCredentials: true })
      .then(() => {
        setUserLogin(null);
        window.location.href = '/login';
      })
      .catch(() => alert('Ошибка при выходе.'));
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
          <li className="profile-menu">
            <Link to="/login">{userLogin || 'Профиль'}</Link>
            <ul className="dropdown">
              <li><Link to="/admin">Admin</Link></li>
              <li><Link to="/manager">Manager</Link></li>
              <li><Link to="/favourites">Избранное</Link></li>
              {userLogin ? (
                <li><button onClick={handleLogout}>Выйти</button></li>
              ) : (
                <li>
                  <Link to="/login">
                    <button>Войти</button>
                  </Link>
                </li>
              )}
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
          <li><Link to="/login" onClick={toggleMenu}>{userLogin || 'Профиль'}</Link></li>
          <li><Link to="/favourites" onClick={toggleMenu}>Избранное</Link></li>
          <li><button onClick={handleLogout}>Выйти</button></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;