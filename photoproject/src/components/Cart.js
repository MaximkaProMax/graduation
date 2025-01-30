import React from 'react';
import './Cart.css';

const Cart = () => {
  const cartItems = [
    {
      album: 'Альбом FlexBind в фотообложке',
      format: '20x30',
      base: 'Без основы',
      pages: 2,
      lamination: 'Глянец',
      copies: 1,
      date: '21.05.2025',
      studio: 'Hot Yellow с песком и циклорамой',
      address: 'г. Москва, ул. Электрозаводская, 21, подъезд К',
      bookingDate: '21.05.2025',
      time: 'С 15:00 до 16:00',
      contactName: 'Жолдашев М.Ф',
      email: 'makszholdashev@gmail.com',
      phone: '+7 977 836 00 27',
      deliveryAddress: 'г. Москва, улица Пушкина д.10',
      total: '1024р',
    },
  ];

  return (
    <div className="cart">
      <h2>Корзина</h2>
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item, index) => (
            <div key={index} className="cart-item">
              <div className="cart-image flex-bind"></div>
              <div className="cart-details">
                <h3>{item.album}</h3>
                <p>Формат: {item.format}</p>
                <p>Основа разворота: {item.base}</p>
                <p>Кол-во разворотов: {item.pages}</p>
                <p>Ламинация: {item.lamination}</p>
                <p>Количество экземпляров: {item.copies}</p>
                <p>Дата: {item.date}</p>
              </div>
            </div>
          ))}

          {cartItems.map((item, index) => (
            <div key={index} className="cart-item">
              <div className="cart-image studio"></div>
              <div className="cart-details">
                <h3>Зал: {item.studio}</h3>
                <p>Адрес: {item.address}</p>
                <p>Дата: {item.bookingDate}</p>
                <p>Время: {item.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="contact-section">
          <div className="contact-details">
            <h3>Контактные данные</h3>
            {cartItems.map((item, index) => (
              <div key={index}>
                <p>ФИО: {item.contactName}</p>
                <p>Почта: {item.email}</p>
                <p>Телефон: {item.phone}</p>
                <p>Адрес доставки: {item.deliveryAddress}</p>
              </div>
            ))}
          </div>
          <div className="price-details">
            <h3>Итоговая цена</h3>
            {cartItems.map((item, index) => (
              <div key={index}>
                <p>{item.total}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;