import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Booking.css';

const Booking = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/bookings/user', {
          withCredentials: true, // Отправляем cookies
        });

        if (response.data.success) {
          setBookings(response.data.bookings);
        } else {
          console.error('Ошибка при загрузке бронирований:', response.data.message);
        }
      } catch (error) {
        console.error('Ошибка при загрузке бронирований:', error);
      }
    };

    fetchBookings();
  }, []);

  const handleDelete = async (bookingId) => {
    try {
      const response = await axios.delete(`http://localhost:3001/api/bookings/${bookingId}`, {
        withCredentials: true, // Отправляем cookies
      });

      if (response.data.success) {
        // Удаляем заявку из состояния
        setBookings((prevBookings) => prevBookings.filter((booking) => booking.booking_typographie_id !== bookingId));
        alert('Заявка успешно удалена!');
      } else {
        alert('Ошибка при удалении заявки');
      }
    } catch (error) {
      console.error('Ошибка при удалении заявки:', error);
      alert('Ошибка при удалении заявки');
    }
  };

  return (
    <div className="booking-container">
      <h1>Мои заявки</h1>
      <table className="booking-table">
        <thead>
          <tr>
            <th>Название альбома</th>
            <th>Статус</th>
            <th>Формат</th>
            <th>Основа разворота</th>
            <th>Количество разворотов</th>
            <th>Ламинация</th>
            <th>Количество копий</th>
            <th>Адрес доставки</th>
            <th>Итоговая цена</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr key={index}>
              <td>{booking.album_name || '-'}</td>
              <td>{booking.status || '-'}</td>
              <td>{booking.format || '-'}</td>
              <td>{booking.the_basis_of_the_spread || '-'}</td>
              <td>{booking.number_of_spreads || '-'}</td>
              <td>{booking.lamination || '-'}</td>
              <td>{booking.number_of_copies || '-'}</td>
              <td>{booking.address_delivery || '-'}</td>
              <td>{booking.final_price || '-'}</td>
              <td>
                <button onClick={() => handleDelete(booking.booking_typographie_id)} className="delete-button">
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Booking;