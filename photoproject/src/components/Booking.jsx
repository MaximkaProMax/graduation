import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Booking.css';

const Booking = () => {
  const [typographyBookings, setTypographyBookings] = useState([]);
  const [studioBookings, setStudioBookings] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [editAddress, setEditAddress] = useState('');
  const [isEditingAddress, setIsEditingAddress] = useState(false);

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
        // Отправляем cookies
        const response = await axios.get('http://localhost:3001/api/bookings/user', {
          withCredentials: true,
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
        // Отправляем cookies
        const response = await axios.get('http://localhost:3001/api/bookings/studios/user', {
          withCredentials: true,
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
        // Отправляем cookies
        const response = await axios.get('http://localhost:3001/api/user/profile', {
          withCredentials: true,
        });
        if (response.data && response.data.success) {
          setUserInfo(response.data.user);
          setEditAddress(response.data.user.address || '');
        }
      } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
      }
    };

    fetchTypographyBookings();
    fetchStudioBookings();
    fetchUserInfo();

    axios.get('http://localhost:3001/api/photostudios').then(res => {
      window.studios = res.data;
    });
    axios.get('http://localhost:3001/api/printing').then(res => {
      window.printingOptions = res.data;
    });
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

  const handleEditAddressClick = () => {
    setIsEditingAddress(true);
  };

  const handleAddressChange = (e) => {
    setEditAddress(e.target.value);
  };

  const handleSaveAddress = async () => {
    try {
      await axios.put(
        'http://localhost:3001/api/users/user',
        { address: editAddress },
        { withCredentials: true }
      );
      setUserInfo((prev) => ({ ...prev, address: editAddress }));
      setIsEditingAddress(false);
    } catch (error) {
      alert('Ошибка при сохранении адреса');
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
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <a href="/login">
            <button style={{ padding: '10px 24px', background: '#ffcc00', border: 'none', borderRadius: 5, fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>
              Войти
            </button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <h2>Мои заявки</h2>
      <div className="cart-content">
        <div className="cart-items">
          {typographyBookings.map((booking, index) => {
            // Загрузка фотографий для типографий из CSS по классу
            let printingImageClass = '';
            const albumName = booking.album_name ? booking.album_name.toLowerCase() : '';

            if (albumName.includes('layflat')) {
              printingImageClass = 'layflat';
            } else if (albumName.includes('flexbind')) {
              printingImageClass = 'flexbind';
            }

            return (
              <div key={index} className="cart-item">
                <div
                  className={`cart-image ${printingImageClass}`}
                ></div>
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
            );
          })}
          {studioBookings.map((booking, index) => {
            // Загрузка фотографий для фотостудий из CSS по классу
            let studioImageClass = '';
            const studioName = booking.studio_name ? booking.studio_name.toLowerCase() : '';
            const address = booking.address ? booking.address.toLowerCase() : '';

            if (
              studioName.includes('cozy') &&
              (studioName.includes('replace') || address.includes('replace'))
            ) {
              studioImageClass = 'replace';
            } else if (
              studioName.includes('apart') &&
              (studioName.includes('photo zall') || address.includes('photo zall'))
            ) {
              studioImageClass = 'apart';
            } else if (
              studioName.includes('hot yellow')
            ) {
              studioImageClass = 'hot-yellow';
            } else if (
              studioName.includes('white garden') &&
              (studioName.includes('unicorn') || address.includes('unicorn'))
            ) {
              studioImageClass = 'white-garden';
            }

            return (
              <div key={index} className="cart-item">
                <div
                  className={`cart-image ${studioImageClass}`}
                ></div>
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
            );
          })}
        </div>
        <div className="contact-section">
          <div className="contact-details">
            <h3>Контактные данные</h3>
            {userInfo ? (
              <div>
                <p>ФИО: {userInfo.fullName || '-'}</p>
                <p>Почта: {userInfo.email || '-'}</p>
                <p>Телефон: {userInfo.phone || '-'}</p>
                <p>
                  Адрес доставки:&nbsp;
                  {isEditingAddress ? (
                    <>
                      <input
                        type="text"
                        value={editAddress}
                        onChange={handleAddressChange}
                        style={{ width: '70%' }}
                      />
                      <button onClick={handleSaveAddress} style={{ marginLeft: 8 }}>Сохранить</button>
                      <button onClick={() => { setIsEditingAddress(false); setEditAddress(userInfo.address || ''); }} style={{ marginLeft: 4 }}>Отмена</button>
                    </>
                  ) : (
                    <>
                      {userInfo.address || '-'}
                      <button onClick={handleEditAddressClick} style={{ marginLeft: 8 }}>Изменить</button>
                    </>
                  )}
                </p>
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