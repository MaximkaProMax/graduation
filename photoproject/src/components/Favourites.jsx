import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Favourites.css';

function Favourites() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

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

    if (isAuthenticated) {
      axios.get('http://localhost:3001/api/favourites', { withCredentials: true })
        .then(response => {
          console.log('Избранные элементы:', response.data);
          setFavorites(response.data.filter(fav => fav !== null)); // Удаляем null-значения
        })
        .catch(error => {
          console.error('Ошибка при загрузке избранных элементов:', error);
        });
    }
  }, [isAuthenticated]);

  const handleBookButtonClick = (studioName, address) => {
    navigate('/calendar', { state: { studio: studioName, address } });
  };

  const handleRemoveFavorite = (id, type) => {
    console.log('Удаление из избранного:', { id, type });
    const endpoint = type === 'photostudio' ? `/${id}` : `/printing/${id}`;
    axios.delete(`http://localhost:3001/api/favourites${endpoint}`, { withCredentials: true })
      .then(() => {
        setFavorites(favorites.filter(fav => fav.id !== id || fav.type !== type));
        toast.info(`${type === 'photостудия' ? 'Фотостудия' : 'Типография'} с ID ${id} удалена из избранного`);
      })
      .catch(error => {
        console.error(`Ошибка при удалении ${type === 'photостудии' ? 'фотостудии' : 'типографии'} из избранного:`, error);
      });
  };

  if (!authChecked) {
    return <div>Загрузка...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="favourites">
        <h2>Избранное</h2>
        <div style={{ color: 'red', fontWeight: 600, textAlign: 'center', margin: '40px 0' }}>
          Для просмотра избранного необходимо авторизоваться в системе.
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

  const photostudios = favorites.filter(fav => fav.type === 'photostudio');
  const printings = favorites.filter(fav => fav.type === 'printing');

  return (
    <div className="favourites">
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
      <h2>Избранное</h2>

      <div className="favourites-section">
        <h3>Избранные фотостудии</h3>
        <div className="studio-list">
          {photostudios.length === 0 ? ( // Исправлено имя переменной
            <p>Нет избранных фотостудий</p>
          ) : (
            photostudios.map((fav) => ( // Исправлено имя переменной
              <div key={fav.id} className="studio-card">
                {fav.photo && fav.photo.startsWith('/src/components/assets/images/Photostudios/') ? (
                  <div
                    className="studio-image"
                    style={{
                      backgroundImage: `url(${fav.photo})`
                    }}
                  />
                ) : (
                  <div className={`studio-image ${fav.photo || ''}`} />
                )}
                <div className="studio-info">
                  <h3>{fav.studio}</h3>
                  <p>{fav.address}</p>
                  <p>{fav.opening_hours}</p>
                  <p>{fav.price}</p>
                </div>
                <div className="action-container">
                  <button
                    className="book-button"
                    onClick={() => handleBookButtonClick(fav.studio, fav.address)}
                  >
                    Забронировать
                  </button>
                  <span
                    className="remove-icon"
                    onClick={() => handleRemoveFavorite(fav.id, fav.type)}
                  >
                    ❌
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="favourites-section">
        <h3>Избранная типография</h3>
        <div className="studio-list">
          {printings.length === 0 ? (
            <p>Нет избранных типографий</p>
          ) : (
            printings.map((fav) => (
              <div key={fav.id} className="printing-card">
                <div className={`printing-image ${fav.main_card_photo || ''}`}></div>
                <div className="printing-info">
                  <h3>{fav.main_album_name}</h3>
                  <p>{fav.main_card_description}</p>
                  <p>Форматы: {fav.format ? fav.format.join(', ') : 'Не указано'}</p>
                </div>
                <div className="printing-action-container">
                  <button
                    className="printing-order-button"
                    onClick={() => toast.info('Бронирование типографий пока недоступно')}
                  >
                    Заказать
                  </button>
                  <span
                    className="remove-icon"
                    onClick={() => handleRemoveFavorite(fav.id, fav.type)}
                  >
                    ❌
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Favourites;