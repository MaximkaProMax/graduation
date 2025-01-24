// src/components/Home.js
import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <main className="main-content">
        <div className="background-image"></div>
        <div className="description">
          PhotoProject - молодая компания, занимающаяся организацией фотосессий
        </div>
        <div className="services">
          <div className="service-box">Помогаем с выбором фотостудий</div>
          <div className="service-box">Подберем лучший вариант для типографии</div>
          <div className="service-box">Обработаем все фотографии со съемки</div>
          <div className="service-box">Выберем удобные даты для бронирования</div>
        </div>
        <button className="cta-button">Создать заявку</button>
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