import React from 'react';
import './Contacts.css';

function Contacts() {
  return (
    <div className="contacts-container">
      <h1>Контакты</h1>
      <p>Добро пожаловать в PhotoProject! Мы специализируемся на бронировании фотостудий и заказе типографий.</p>
      <h2>Наши контакты</h2>
      <ul>
        <li>Телефон: +79037368181</li>
        <li>Email: photoproject@yandex.ru</li>
        <li>Адрес: город Москва, ул Сталеваров, д. 10 к. 1, кв. 231</li>
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