import React from 'react';
import './Contacts.css';

function Contacts() {
  return (
    <div className="contacts-container">
      <h1>Контакты</h1>
      <p>Добро пожаловать в PhotoProject! Мы специализируемся на бронировании фотостудий и заказе типографий.</p>
      <h2>Наши контакты</h2>
      <ul>
        <li>Телефон: +7 (123) 456-78-90</li>
        <li>Email: info@photoproject.com</li>
        <li>Адрес: г. Москва, ул. Примерная, д. 10</li>
      </ul>
      <h2>О нас</h2>
      <p>
        PhotoProject — это платформа, которая помогает вам легко и быстро забронировать фотостудию для ваших мероприятий
        или заказать услуги типографии для создания качественной продукции.
      </p>
    </div>
  );
}

export default Contacts;