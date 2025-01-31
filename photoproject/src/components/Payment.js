import React from 'react';
import './Payment.css';
import sbpLogo from './assets/images/sbp.png'; // Импортируем логотип

const Payment = () => {
  return (
    <div className="payment-container">
      <div className="payment-header">
        <img src={sbpLogo} alt="сбп" className="sbp-logo" /> {/* Используем стандартный тег img */}
        <h2 className="payment-title">Оплата</h2>
      </div>
      <form className="payment-form">
        <div className="form-group">
          <label htmlFor="card-number">Номер карты</label>
          <input type="text" id="card-number" name="card-number" required />
        </div>
        <div className="form-group">
          <label htmlFor="expiration-date">Срок действия</label>
          <input type="text" id="expiration-date" name="expiration-date" required />
        </div>
        <div className="form-group">
          <label htmlFor="cvc">CVC Код</label>
          <input type="text" id="cvc" name="cvc" required />
        </div>
        <div className="form-group">
          <label htmlFor="amount">Сумма</label>
          <input type="text" id="amount" name="amount" required value="1024р" readOnly />
        </div>
        <button type="submit" className="payment-button">Оплатить</button>
      </form>
    </div>
  );
};

export default Payment;