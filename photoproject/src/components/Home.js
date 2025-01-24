// src/components/Home.js
import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <main className="main-content">
        <div className="background-image"></div>
        <div className="overlay-text">
          <div className="text-box">Помогаем с выбором фотостудий</div>
          <div className="text-box">Обработаем все фотографии со съемки</div>
          <div className="text-box">Подберем лучший вариант для типографии</div>
          <div className="text-box">Выберем удобные даты для бронирования</div>
          <button className="cta-button">Создать заявку</button>
        </div>
      </main>
      <footer className="footer">
        <a href="#">Политика конфиденциальности</a>
        <div>PhotoProject 2025©</div>
        <a href="#">О компании</a>
        <a href="#">Контакты</a>
        <a href="#">Отзывы</a>
      </footer>
    </div>
  );
}

export default Home;