import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Requests.css';

const Requests = () => {
  const [typographyBookings, setTypographyBookings] = useState([]);
  const [studioBookings, setStudioBookings] = useState([]);

  useEffect(() => {
    fetchAllRequests();
  }, []);

  const fetchAllRequests = async () => {
    try {
      // Получение всех заявок на типографию
      const typographyResponse = await axios.get('http://localhost:3001/api/bookings/typography/all', {
        withCredentials: true,
      });
      setTypographyBookings(typographyResponse.data.bookings);

      // Получение всех заявок на фотостудии
      const studioResponse = await axios.get('http://localhost:3001/api/bookings/studios/all', {
        withCredentials: true,
      });
      setStudioBookings(studioResponse.data.bookings);
    } catch (error) {
      console.error('Ошибка при загрузке заявок:', error);
    }
  };

  return (
    <div className="requests-container">
      <h2>Все заказы пользователей</h2>

      <h3>Заказы на типографию</h3>
      <div className="table-container">
        <table className="requests-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Пользователь</th>
              <th>Статус</th>
              <th>Формат</th>
              <th>Основа разворота</th>
              <th>Количество разворотов</th>
              <th>Ламинация</th>
              <th>Количество копий</th>
              <th>Адрес доставки</th>
              <th>Итоговая цена</th>
              <th>Название альбома</th>
              <th>Дата создания</th>
              <th>Дата обновления</th>
            </tr>
          </thead>
          <tbody>
            {typographyBookings.map((booking) => (
              <tr key={booking.booking_typographie_id}>
                <td>{booking.booking_typographie_id}</td>
                <td>{booking.user}</td>
                <td>{booking.status}</td>
                <td>{booking.format}</td>
                <td>{booking.the_basis_of_the_spread}</td>
                <td>{booking.number_of_spreads}</td>
                <td>{booking.lamination}</td>
                <td>{booking.number_of_copies}</td>
                <td>{booking.address_delivery}</td>
                <td>{booking.final_price}</td>
                <td>{booking.album_name}</td>
                <td>{new Date(booking.created_at).toLocaleDateString()}</td>
                <td>{new Date(booking.updated_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Заказы на фотостудии</h3>
      <div className="table-container">
        <table className="requests-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Пользователь</th>
              <th>Название студии</th>
              <th>Статус</th>
              <th>Дата</th>
              <th>Время</th>
              <th>Адрес</th>
              <th>Итоговая цена</th>
              <th>Дата создания</th>
              <th>Дата обновления</th>
            </tr>
          </thead>
          <tbody>
            {studioBookings.map((booking) => (
              <tr key={booking.booking_studio_id}>
                <td>{booking.booking_studio_id}</td>
                <td>{booking.user}</td>
                <td>{booking.studio_name}</td>
                <td>{booking.status}</td>
                <td>{booking.date}</td>
                <td>{booking.time}</td>
                <td>{booking.address}</td>
                <td>{booking.final_price}</td>
                <td>{new Date(booking.created_at).toLocaleDateString()}</td>
                <td>{new Date(booking.updated_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Requests;