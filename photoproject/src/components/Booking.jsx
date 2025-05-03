import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Booking.css';

const Booking = () => {
  const [typographyBookings, setTypographyBookings] = useState([]);
  const [studioBookings, setStudioBookings] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    // Проверка авторизации
    axios.get('http://localhost:3001/api/auth/check', { withCredentials: true })
      .then(response => {
        setIsAuthenticated(response.data.isAuthenticated);
        setAuthChecked(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setAuthChecked(true);
      });
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

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

    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/user/profile', {
          withCredentials: true,
        });
        if (response.data && response.data.success) {
          setUserInfo(response.data.user);
        }
      } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
      }
    };

    fetchTypographyBookings();
    fetchStudioBookings();
    fetchUserInfo();
  }, [isAuthenticated]);

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

  if (!authChecked) {
    return <div>Загрузка...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="cart">
        <h2>Мои заявки</h2>
        <div style={{ color: 'red', fontWeight: 600, textAlign: 'center', margin: '40px 0' }}>
          Для просмотра заявок необходимо авторизоваться в системе.
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <h2>Мои заявки на типографию</h2>
      <div className="cart-content">
        <div className="cart-items">
          {typographyBookings.map((booking, index) => (
            <div key={index} className="cart-item">
              <div className="cart-image flex-bind"></div>
              <div className="cart-details">
                <h3>{booking.album_name || '-'}</h3>
                <p>Формат: {booking.format || '-'}</p>
                <p>Основа разворота: {booking.the_basis_of_the_spread || '-'}</p>
                <p>Кол-во разворотов: {booking.number_of_spreads || '-'}</p>
                <p>Ламинация: {booking.lamination || '-'}</p>
                <p>Количество экземпляров: {booking.number_of_copies || '-'}</p>
                <p>Адрес доставки: {booking.address_delivery || '-'}</p>
                <p>Статус: {booking.status || '-'}</p>
                <p>Итоговая цена: {booking.final_price || '-'}</p>
                <button onClick={() => handleDeleteTypographyBooking(booking.booking_typographie_id)} className="delete-button">
                  Удалить
                </button>
              </div>
            </div>
          ))}
          {studioBookings.map((booking, index) => (
            <div key={index} className="cart-item">
              <div className="cart-image studio"></div>
              <div className="cart-details">
                <h3>{booking.studio_name || '-'}</h3>
                <p>Адрес: {booking.address || '-'}</p>
                <p>Дата: {booking.date || '-'}</p>
                <p>Время: {booking.time || '-'}</p>
                <p>Статус: {booking.status || '-'}</p>
                <p>Итоговая цена: {booking.final_price || '-'}</p>
                <button onClick={() => handleDeleteStudioBooking(booking.booking_studio_id)} className="delete-button">
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="contact-section">
          <div className="contact-details">
            <h3>Контактные данные</h3>
            {userInfo ? (
              <div>
                <p>ФИО: {userInfo.fullName || '-'}</p>
                <p>Почта: {userInfo.email || '-'}</p>
                <p>Телефон: {userInfo.phone || '-'}</p>
                <p>Адрес доставки: {userInfo.address || '-'}</p>
              </div>
            ) : (
              <p>Загрузка...</p>
            )}
          </div>
          <div className="price-details">
            <h3>Итоговая цена</h3>
            <div>
              {(() => {
                const total =
                  [...typographyBookings, ...studioBookings]
                    .map(b => Number(b.final_price) || 0)
                    .reduce((a, b) => a + b, 0);
                return <p>{total ? `${total}₽` : '-'}</p>;
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;