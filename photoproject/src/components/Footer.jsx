import React from 'react';
import { Link } from 'react-router-dom'; // Импортируем Link
import './Footer.css';

function Footer() {
  return (
    <div className="footer-container">
      <footer className="footer">
        <Link to="/privacy-policy">Политика конфиденциальности</Link>
        <div>PhotoProject 2025©</div>
        <Link to="/contacts">Контакты</Link>
        <Link to="/reviews">Отзывы</Link>
      </footer>
    </div>
  );
}

export default Footer;