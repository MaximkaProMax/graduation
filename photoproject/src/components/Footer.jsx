import React from 'react';
import { Link } from 'react-router-dom'; // Импортируем Link
import './Footer.css';

function Footer() {
  return (
    <div className="footer-container">
      <footer className="footer">
        <a href="#">Политика конфиденциальности</a>
        <div>PhotoProject 2025©</div>
        <a href="#">О компании</a>
        <a href="#">Контакты</a>
        <Link to="/reviews">Отзывы</Link> {/* Используем Link для перехода на страницу отзывов */}
      </footer>
    </div>
  );
}

export default Footer;