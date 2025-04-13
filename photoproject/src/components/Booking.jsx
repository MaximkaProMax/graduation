import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Booking.css';

const Booking = () => {
  const [typographyBookings, setTypographyBookings] = useState([]);
  const [studioBookings, setStudioBookings] = useState([]);

  useEffect(() => {
    const fetchTypographyBookings = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/bookings/user', {
          withCredentials: true, // Отправляем cookies
        });

        if (response.data.success) {
          setTypographyBookings(response.data.bookings);
        } else {
          console.error('Ошибка при загрузке бронирований типографии:', response.data.message);
        }
      } catch (error) {
        console.error('Ошибка при загрузке бронирований типографии:', error);
      }
    };

    const fetchStudioBookings = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/bookings/studios/user', {
          withCredentials: true, // Отправляем cookies
        });

        if (response.data.success) {
          setStudioBookings(response.data.bookings);
        } else {
          console.error('Ошибка при загрузке бронирований студии:', response.data.message);
        }
      } catch (error) {
        console.error('Ошибка при загрузке бронирований студии:', error);
      }
    };

    fetchTypographyBookings();
    fetchStudioBookings();
  }, []);

  const handleDeleteTypographyBooking = async (bookingId) => {
    try {
      const response = await axios.delete(`http://localhost:3001/api/bookings/typography/${bookingId}`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setTypographyBookings((prev) => prev.filter((booking) => booking.booking_typographie_id !== bookingId));
        alert('Заявка на типографию успешно удалена!');
      } else {
        alert('Ошибка при удалении заявки на типографию');
      }
    } catch (error) {
      console.error('Ошибка при удалении заявки на типографию:', error);
      alert('Ошибка при удалении заявки на типографию');
    }
  };

  const handleDeleteStudioBooking = async (bookingId) => {
    try {
      const response = await axios.delete(`http://localhost:3001/api/bookings/studios/${bookingId}`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setStudioBookings((prev) => prev.filter((booking) => booking.booking_studio_id !== bookingId));
        alert('Заявка на фотостудию успешно удалена!');
      } else {
        alert('Ошибка при удалении заявки на фотостудию');
      }
    } catch (error) {
      console.error('Ошибка при удалении заявки на фотостудию:', error);
      alert('Ошибка при удалении заявки на фотостудию');
    }
  };

  return (
    <div className="booking-container">
      <h1>Мои заявки на типографию</h1>
      <div className="table-container">
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
            {typographyBookings.map((booking, index) => (
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
                  <button onClick={() => handleDeleteTypographyBooking(booking.booking_typographie_id)} className="delete-button">
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h1>Мои заявки на фотостудию</h1>
      <div className="table-container">
        <table className="booking-table">
          <thead>
            <tr>
              <th>Название студии</th>
              <th>Статус</th>
              <th>Дата</th>
              <th>Время</th>
              <th>Адрес</th>
              <th>Итоговая цена</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {studioBookings.map((booking, index) => (
              <tr key={index}>
                <td>{booking.studio_name || '-'}</td>
                <td>{booking.status || '-'}</td>
                <td>{booking.date || '-'}</td>
                <td>{booking.time || '-'}</td>
                <td>{booking.address || '-'}</td>
                <td>{booking.final_price || '-'}</td>
                <td>
                  <button onClick={() => handleDeleteStudioBooking(booking.booking_studio_id)} className="delete-button">
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Booking;