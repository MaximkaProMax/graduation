import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Payments.css';
import axios from 'axios';

const Payments = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId, bookingType, amount, status: initialStatus, bookingData } = location.state || {};
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [sum] = useState(amount || '');
  const [status, setStatus] = useState(initialStatus || 'Не оплачено');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) return 'Введите корректный номер карты (16 цифр)';
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) return 'Введите срок действия в формате MM/YY';
    if (!/^\d{3}$/.test(cvc)) return 'Введите корректный CVC (3 цифры)';
    if (!sum || isNaN(sum) || Number(sum) <= 0) return 'Введите корректную сумму';
    return '';
  };

  const handlePay = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(async () => {
      try {
        if (bookingType === 'photostudio') {
          if (!bookingData) {
            setError('Нет данных для обновления заказа. Попробуйте обновить страницу.');
            setLoading(false);
            return;
          }
          await axios.put(
            `http://localhost:3001/api/bookings/studios/${bookingId}`,
            {
              ...bookingData,
              status: 'Оплачено'
            },
            { withCredentials: true }
          );
        } else if (bookingType === 'typographie') {
          if (!bookingData) {
            setError('Нет данных для обновления заказа. Попробуйте обновить страницу.');
            setLoading(false);
            return;
          }
          await axios.put(
            `http://localhost:3001/api/bookings/typography/${bookingId}`,
            {
              ...bookingData,
              status: 'Оплачено'
            },
            { withCredentials: true }
          );
        }
        setStatus('Оплачено');
        setTimeout(() => {
          navigate('/booking');
        }, 1500);
      } catch (err) {
        setError('Ошибка при обновлении статуса оплаты');
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="payments-page">
      <div className="payments-form-container">
        <div className="payment-logo"></div>
        <h2>Оплата</h2>
        <form onSubmit={handlePay}>
          <label>Номер карты</label>
          <input
            type="text"
            maxLength={16}
            value={cardNumber}
            onChange={e => setCardNumber(e.target.value.replace(/\D/g, ''))}
            placeholder="0000 0000 0000 0000"
            disabled={status === 'Оплачено'}
          />
          <label>Срок действия</label>
          <input
            type="text"
            maxLength={5}
            value={expiry}
            onChange={e => setExpiry(e.target.value.replace(/[^0-9/]/g, '').replace(/^(\d{2})(\d)/, '$1/$2'))}
            placeholder="MM/YY"
            disabled={status === 'Оплачено'}
          />
          <label>CVC Код</label>
          <input
            type="password"
            maxLength={3}
            value={cvc}
            onChange={e => setCvc(e.target.value.replace(/\D/g, ''))}
            placeholder="123"
            disabled={status === 'Оплачено'}
          />
          <label>Сумма</label>
          <input
            type="number"
            value={sum}
            readOnly
            disabled
            placeholder="Сумма"
          />
          <div className="payment-status">
            Статус оплаты: <span className={status === 'Оплачено' ? 'paid' : 'not-paid'}>{status}</span>
          </div>
          {error && <div className="payment-error">{error}</div>}
          <button type="submit" className="pay-btn" disabled={status === 'Оплачено' || loading}>
            {loading ? 'Оплата...' : 'Оплатить'}
          </button>
        </form>
        <button className="back-btn" onClick={() => navigate(-1)} style={{ marginTop: 18 }}>Назад</button>
      </div>
    </div>
  );
};

export default Payments;
