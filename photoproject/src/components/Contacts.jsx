import React from 'react';
import './Contacts.css';

function Contacts() {
  return (
    <div className="contacts-container">
      <h1>Контакты</h1>
      <p>Добро пожаловать в PhotoProject! Мы специализируемся на бронировании фотостудий и заказе типографий.</p>
      <h2>О нас</h2>
      <p>
        PhotoProject — это платформа, которая помогает вам легко и быстро забронировать фотостудию для ваших мероприятий
        или заказать услуги типографии для создания качественной продукции.
      </p>
      <h2>Наши контакты</h2>
      <ul>
        <li>Телефон: +7 (903) 736 81 81</li>
        <li>Email: photoproject@yandex.ru</li>
        <li>Адрес: город Москва, ул Сталеваров, д. 10 к. 1, кв. 231</li>
      </ul>
      <div style={{ margin: '32px 0', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <iframe
          title="Яндекс Карта"
          src="https://yandex.ru/map-widget/v1/?ll=37.769993%2C55.809032&z=16&mode=search&text=Москва%2C%20ул%20Сталеваров%2C%2010%20к1"
          width="100%"
          height="400"
          frameBorder="0"
          style={{ borderRadius: 10, maxWidth: 700, minWidth: 320 }}
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

export default Contacts;