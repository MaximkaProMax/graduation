import React, { useState, useEffect } from 'react';
import './Booking.css';

const Booking = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // В реальном приложении данные будут получены из базы данных
    const fetchData = async () => {
      const data = [
        {
          studio: 'Зал Cozy',
          typography: 'FlexBind',
          dates: ['21.05.2025', '21.06.2025'],
          response: 'Посмотреть',
          status: 'В пути',
          total: '20.000₽'
        },
        {
          studio: 'Зал Garden',
          typography: 'LayFlat',
          dates: ['22.06.2025', '22.07.2025'],
          response: 'Посмотреть',
          status: 'Готов',
          total: '30.000₽'
        },
        {
          studio: 'Зал Replace',
          typography: 'FlexBind',
          dates: ['23.07.2025', '23.08.2025'],
          response: 'Посмотреть',
          status: 'Готов',
          total: '40.000₽'
        },
      ];
      setBookings(data);
    };

    fetchData();
  }, []);

  return (
    <div className="booking-container">
      <h1>Мои заявки</h1>
      <table className="booking-table">
        <thead>
          <tr>
            <th>Студия</th>
            <th>Типография</th>
            <th>Даты</th>
            <th>Ответ</th>
            <th>Статус</th>
            <th>Итог</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr key={index}>
              <td>{booking.studio}</td>
              <td>{booking.typography}</td>
              <td>{booking.dates.join(', ')}</td>
              <td>{booking.response}</td>
              <td>{booking.status}</td>
              <td>{booking.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Booking;