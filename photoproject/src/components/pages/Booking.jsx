import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/Booking.css";

const Booking = () => {
  const [typographyBookings, setTypographyBookings] = useState([]);
  const [studioBookings, setStudioBookings] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [editAddress, setEditAddress] = useState('');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [studiosList, setStudiosList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Проверка авторизации (делаем только 1 запрос)
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
        // Исправлено: правильный эндпоинт для получения профиля пользователя
        const response = await axios.get('http://localhost:3001/api/users/user', {
          withCredentials: true,
        });
        if (response.data) {
          // Для совместимости с текущим кодом
          setUserInfo({
            fullName: response.data.name,
            email: response.data.email,
            phone: response.data.telephone,
            address: response.data.address,
          });
          setEditAddress(response.data.address || '');
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
      setStudiosList(res.data);
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
        toast.success('Заявка на типографию успешно удалена!');
      } else {
        toast.error('Ошибка при удалении заявки на типографию');
      }
    } catch (error) {
      console.error('Ошибка при удалении заявки на типографию:', error);
      toast.error('Ошибка при удалении заявки на типографию');
    }
  };

  const handleDeleteStudioBooking = async (bookingId) => {
    try {
      const response = await axios.delete(`http://localhost:3001/api/bookings/studios/${bookingId}`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setStudioBookings((prev) => prev.filter((booking) => booking.booking_studio_id !== bookingId));
        toast.success('Заявка на фотостудию успешно удалена!');
      } else {
        toast.error('Ошибка при удалении заявки на фотостудию');
      }
    } catch (error) {
      console.error('Ошибка при удалении заявки на фотостудию:', error);
      toast.error('Ошибка при удалении заявки на фотостудию');
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
      // Получаем актуальные данные пользователя
      const userRes = await axios.get('http://localhost:3001/api/users/user', { withCredentials: true });
      const userData = userRes.data;

      // Собираем все поля, которые ожидает сервер (иначе сервер может отклонить запрос)
      const payload = {
        name: userData.name,
        login: userData.login,
        telephone: userData.telephone,
        email: userData.email,
        address: editAddress
      };

      // ВАЖНО: используем PATCH вместо PUT, чтобы не требовать userId из сессии (аутентификация по токену)
      await axios.patch(
        'http://localhost:3001/api/users/user',
        payload,
        { withCredentials: true }
      );
      setUserInfo((prev) => ({ ...prev, address: editAddress }));
      setIsEditingAddress(false);
      toast.success('Адрес успешно сохранён!');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error('Сессия истекла. Пожалуйста, войдите снова.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      } else {
        toast.error('Ошибка при сохранении адреса');
      }
    }
  };

  // Разделение заявок на оплаченные и не оплаченные
  const unpaidTypographyBookings = typographyBookings.filter(b => b.status !== 'Оплачено');
  const paidTypographyBookings = typographyBookings.filter(b => b.status === 'Оплачено');
  const unpaidStudioBookings = studioBookings.filter(b => b.status !== 'Оплачено');
  const paidStudioBookings = studioBookings.filter(b => b.status === 'Оплачено');

  if (!authChecked) {
    return <div>Загрузка...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="cart">
        <h2>Мои заявки</h2>
        <div className="auth-warning">
          Для просмотра заявок необходимо авторизоваться в системе.
        </div>
        <div className="auth-button-container">
          <a href="/login">
            <button className="login-btn">
              Войти
            </button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
      <h2>Мои заявки</h2>
      {/* Контактные данные теперь вне cart-content и всегда сверху */}
      <div className="contact-section contact-section-centered">
        <div className="contact-details">
          <h3>Контактные данные</h3>
          {userInfo ? (
            <div>
              <p>
                Телефон:&nbsp;
                {isEditingAddress ? (
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={userInfo.phone || ''}
                    onChange={e => {
                      const onlyDigits = e.target.value.replace(/\D/g, '');
                      setUserInfo(prev => ({ ...prev, phone: onlyDigits }));
                    }}
                    className="address-input"
                  />
                ) : (
                  userInfo.phone || '-'
                )}
              </p>
              <p>
                Адрес доставки:&nbsp;
                {isEditingAddress ? (
                  <>
                    <input
                      type="text"
                      value={editAddress}
                      onChange={handleAddressChange}
                      className="address-input"
                    />
                    <button
                      onClick={async () => {
                        try {
                          // Собираем все поля для PATCH
                          const userRes = await axios.get('http://localhost:3001/api/users/user', { withCredentials: true });
                          const userData = userRes.data;
                          const payload = {
                            name: userData.name,
                            login: userData.login,
                            telephone: userInfo.phone,
                            email: userData.email,
                            address: editAddress
                          };
                          await axios.patch(
                            'http://localhost:3001/api/users/user',
                            payload,
                            { withCredentials: true }
                          );
                          setUserInfo(prev => ({ ...prev, address: editAddress }));
                          setIsEditingAddress(false);
                          toast.success('Данные успешно сохранены!');
                        } catch (error) {
                          if (error.response && error.response.status === 401) {
                            toast.error('Сессия истекла. Пожалуйста, войдите снова.');
                            setTimeout(() => {
                              window.location.href = '/login';
                            }, 1500);
                          } else {
                            toast.error('Ошибка при сохранении данных');
                          }
                        }
                      }}
                      className="save-btn"
                    >Сохранить</button>
                    <button
                      onClick={() => {
                        setIsEditingAddress(false);
                        setEditAddress(userInfo.address || '');
                      }}
                      className="cancel-btn"
                    >Отмена</button>
                  </>
                ) : (
                  <>
                    {userInfo.address || '-'}
                    <button onClick={handleEditAddressClick} className="edit-btn">Изменить</button>
                  </>
                )}
              </p>
            </div>
          ) : (
            <p>Загрузка...</p>
          )}
        </div>
      </div>
      {/* Секции заявок теперь идут ниже и по центру */}
      <div className="cart-content">
        {/* Не оплаченные заявки */}
        <div>
          <h3 className="section-title">Не оплаченные заявки</h3>
          <div className="cart-items cart-items-centered">
            {unpaidTypographyBookings.map((booking, index) => {
              let printingImageClass = '';
              const albumName = booking.album_name ? booking.album_name.toLowerCase() : '';

              if (albumName.includes('layflat')) {
                printingImageClass = 'layflat';
              } else if (albumName.includes('flexbind')) {
                printingImageClass = 'flexbind';
              }

              return (
                <div key={`unpaid-typography-${index}`} className="cart-item booking-card">
                  <div className={`cart-image ${printingImageClass}`}></div>
                  <div className="cart-details booking-info">
                    <h3 className="booking-title">{booking.album_name || '-'}</h3>
                    <p>Формат: {booking.format || '-'}</p>
                    <p>Основа разворота: {booking.the_basis_of_the_spread || '-'}</p>
                    <p>Кол-во разворотов: {booking.number_of_spreads || '-'}</p>
                    <p>Ламинация: {booking.lamination || '-'}</p>
                    <p>Количество экземпляров: {booking.number_of_copies || '-'}</p>
                    {/* <p>Адрес доставки: {booking.address_delivery || '-'}</p> */}
                    <p>Статус: {booking.status || '-'}</p>
                    <div className="booking-actions">
                      <div className="booking-price-total">
                        Итоговая цена:
                        <span className="final-price-span booking-price">
                          {booking.final_price ? `${parseInt(booking.final_price, 10)}₽` : '-'}
                        </span>
                      </div>
                      {booking.status !== 'Оплачено' && (
                        <button
                          className="pay-btn pay-btn-custom"
                          onClick={() => navigate('/payments', {
                            state: {
                              bookingId: booking.booking_typographie_id,
                              bookingType: 'typographie',
                              amount: booking.final_price,
                              status: booking.status,
                              bookingData: {
                                format: booking.format,
                                the_basis_of_the_spread: booking.the_basis_of_the_spread,
                                number_of_spreads: booking.number_of_spreads,
                                lamination: booking.lamination,
                                number_of_copies: booking.number_of_copies,
                                address_delivery: booking.address_delivery,
                                final_price: booking.final_price,
                                album_name: booking.album_name
                              }
                            }
                          })}
                        >
                          Оплатить
                        </button>
                      )}
                      <button onClick={() => handleDeleteTypographyBooking(booking.booking_typographie_id)} className="delete-button">
                        Удалить
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {unpaidStudioBookings.map((booking, index) => {
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

              let studioPhoto = '';
              if (studiosList.length > 0) {
                const foundStudio = studiosList.find(
                  s => s.id === booking.studio_id || s.studio === booking.studio_name
                );
                if (foundStudio && foundStudio.photo && foundStudio.photo.startsWith('/src/components/assets/images/Photostudios/')) {
                  studioPhoto = foundStudio.photo;
                }
              }

              return (
                <div key={`unpaid-studio-${index}`} className="cart-item booking-card">
                  {studioPhoto ? (
                    <div
                      className="cart-image"
                      style={{
                        backgroundImage: `url(${studioPhoto})`
                      }}
                    />
                  ) : (
                    <div className={`cart-image ${studioImageClass}`} />
                  )}
                  <div className="cart-details booking-info">
                    <h3 className="booking-title">{booking.studio_name || '-'}</h3>
                    <p>Адрес: {booking.address || '-'}</p>
                    <p>Дата: {booking.date || '-'}</p>
                    <p>Время: {booking.time || '-'}</p>
                    <p>Статус: {booking.status || '-'}</p>
                    <div className="booking-actions">
                      <div className="booking-price-total">
                        Итоговая цена:
                        <span className="final-price-span booking-price">
                          {booking.final_price ? `${parseInt(booking.final_price, 10)}₽` : '-'}
                        </span>
                      </div>
                      {booking.status !== 'Оплачено' && (
                        <button
                          className="pay-btn pay-btn-custom"
                          onClick={() => navigate('/payments', {
                            state: {
                              bookingId: booking.booking_studio_id,
                              bookingType: 'photostudio',
                              amount: booking.final_price,
                              status: booking.status,
                              bookingData: {
                                studio_name: booking.studio_name,
                                date: booking.date,
                                time: booking.time,
                                end_time: booking.end_time,
                                address: booking.address,
                                final_price: booking.final_price
                              }
                            }
                          })}
                        >
                          Оплатить
                        </button>
                      )}
                      <button onClick={() => handleDeleteStudioBooking(booking.booking_studio_id)} className="delete-button">
                        Удалить
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {unpaidTypographyBookings.length === 0 && unpaidStudioBookings.length === 0 && (
              <div className="centered-message">Нет не оплаченных заявок</div>
            )}
          </div>
        </div>
        {/* Оплаченные заявки */}
        <div className="section-spaced">
          <h3>Оплаченные заявки</h3>
          <div className="cart-items cart-items-centered">
            {paidTypographyBookings.map((booking, index) => {
              let printingImageClass = '';
              const albumName = booking.album_name ? booking.album_name.toLowerCase() : '';

              if (albumName.includes('layflat')) {
                printingImageClass = 'layflat';
              } else if (albumName.includes('flexbind')) {
                printingImageClass = 'flexbind';
              }

              return (
                <div key={`paid-typography-${index}`} className="cart-item booking-card">
                  <div className={`cart-image ${printingImageClass}`}></div>
                  <div className="cart-details booking-info">
                    <h3 className="booking-title">{booking.album_name || '-'}</h3>
                    <p>Формат: {booking.format || '-'}</p>
                    <p>Основа разворота: {booking.the_basis_of_the_spread || '-'}</p>
                    <p>Кол-во разворотов: {booking.number_of_spreads || '-'}</p>
                    <p>Ламинация: {booking.lamination || '-'}</p>
                    <p>Количество экземпляров: {booking.number_of_copies || '-'}</p>
                    {/* <p>Адрес доставки: {booking.address_delivery || '-'}</p> */}
                    <p>Статус: {booking.status || '-'}</p>
                    <div className="booking-actions">
                      <div className="booking-price-total">
                        Итоговая цена:
                        <span className="final-price-span booking-price">
                          {booking.final_price ? `${parseInt(booking.final_price, 10)}₽` : '-'}
                        </span>
                      </div>
                      <button onClick={() => handleDeleteTypographyBooking(booking.booking_typographie_id)} className="delete-button">
                        Удалить
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {paidStudioBookings.map((booking, index) => {
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

              let studioPhoto = '';
              if (studiosList.length > 0) {
                const foundStudio = studiosList.find(
                  s => s.id === booking.studio_id || s.studio === booking.studio_name
                );
                if (foundStudio && foundStudio.photo && foundStudio.photo.startsWith('/src/components/assets/images/Photostudios/')) {
                  studioPhoto = foundStudio.photo;
                }
              }

              return (
                <div key={`paid-studio-${index}`} className="cart-item booking-card">
                  {studioPhoto ? (
                    <div
                      className="cart-image"
                      style={{
                        backgroundImage: `url(${studioPhoto})`
                      }}
                    />
                  ) : (
                    <div className={`cart-image ${studioImageClass}`} />
                  )}
                  <div className="cart-details booking-info">
                    <h3 className="booking-title">{booking.studio_name || '-'}</h3>
                    <p>Адрес: {booking.address || '-'}</p>
                    <p>Дата: {booking.date || '-'}</p>
                    <p>Время: {booking.time || '-'}</p>
                    <p>Статус: {booking.status || '-'}</p>
                    <div className="booking-actions">
                      <div className="booking-price-total">
                        Итоговая цена:
                        <span className="final-price-span booking-price">
                          {booking.final_price ? `${parseInt(booking.final_price, 10)}₽` : '-'}
                        </span>
                      </div>
                      <button onClick={() => handleDeleteStudioBooking(booking.booking_studio_id)} className="delete-button">
                        Удалить
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {paidTypographyBookings.length === 0 && paidStudioBookings.length === 0 && (
              <div className="centered-message">Нет оплаченных заявок</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;