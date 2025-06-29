import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/Favourites.css";

function Favourites() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Просто делаем запрос к защищённому эндпоинту
    axios.get('http://localhost:3001/api/favourites', { withCredentials: true })
      .then(response => {
        setIsAuthenticated(true);
        setAuthChecked(true);
        setFavorites(response.data.filter(fav => fav !== null));
      })
      .catch(error => {
        setIsAuthenticated(false);
        setAuthChecked(true);
      });
  }, []);

  const handleBookButtonClick = (studioName, address, price) => {
    navigate('/calendar', { state: { studio: studioName, address, price } });
  };

  const handleOrderPrinting = (printingId) => {
    navigate(`/printing/${printingId}`);
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

  // Группировка по 2 карточки в ряд
  function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

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

      {/* Фотостудии */}
      <div className="favourites-section">
        <h3>Избранные фотостудии</h3>
        <div className="favourites-items-centered">
          {photostudios.length === 0 ? (
            <p>Нет избранных фотостудий</p>
          ) : (
            chunkArray(photostudios, 2).map((row, rowIdx) => (
              <div className="favourites-row" key={rowIdx}>
                {row.map((fav) => (
                  <div key={fav.id} className="fav-card studio-card modern">
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
                      <div className="studio-main-info">
                        <h3>{fav.studio}</h3>
                        <p className="studio-address">{fav.address}</p>
                      </div>
                      <div className="studio-details-row">
                        <span className="studio-hours">{fav.opening_hours}</span>
                        <span className="studio-price">{fav.price}</span>
                      </div>
                      <div className="action-container modern">
                        <div className="action-inner-grid">
                          <button
                            className="book-button modern"
                            onClick={() => handleBookButtonClick(fav.studio, fav.address, fav.price)}
                          >
                            Забронировать
                          </button>
                          <span
                            className="remove-icon modern"
                            onClick={() => handleRemoveFavorite(fav.id, fav.type)}
                            title="Удалить из избранного"
                          >
                            ❌
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Типографии */}
      <div className="favourites-section">
        <h3>Избранные типографии</h3>
        <div className="favourites-items-centered">
          {printings.length === 0 ? (
            <p>Нет избранных типографий</p>
          ) : (
            chunkArray(printings, 2).map((row, rowIdx) => (
              <div className="favourites-row" key={rowIdx}>
                {row.map((fav) => (
                  <div key={fav.id} className="fav-card printing-card modern">
                    {fav.main_card_photo && fav.main_card_photo.startsWith('/src/components/assets/images/Printing/') ? (
                      <div
                        className="printing-image"
                        style={{
                          backgroundImage: `url(${fav.main_card_photo})`
                        }}
                      />
                    ) : (
                      <div className={`printing-image ${fav.main_card_photo || ''}`} />
                    )}
                    <div className="printing-info">
                      <div className="printing-main-info">
                        <h3>{fav.main_album_name}</h3>
                        <p className="printing-description">{fav.main_card_description}</p>
                      </div>
                      <div className="printing-details-row">
                        <span className="printing-formats">
                          {fav.format ? fav.format.join(' / ') : 'Не указано'}
                        </span>
                        {fav.price && (
                          <span className="printing-price">{fav.price}₽</span>
                        )}
                      </div>
                      <div className="action-container modern">
                        <div className="action-inner-grid">
                          <button
                            className="order-button modern"
                            onClick={() => handleOrderPrinting(fav.id)}
                          >
                            Заказать
                          </button>
                          <span
                            className="remove-icon modern"
                            onClick={() => handleRemoveFavorite(fav.id, fav.type)}
                            title="Удалить из избранного"
                          >
                            ❌
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Favourites;