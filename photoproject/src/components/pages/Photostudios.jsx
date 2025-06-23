import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Photostudios.css';
import BookedIcon from '../assets/images/Favourites/Booked.svg';
import NotBookedIcon from '../assets/images/Favourites/NotBooked.svg';

function Photostudios() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [studios, setStudios] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Состояние для строки поиска

  useEffect(() => {
    // Загрузка данных из API
    axios.get('http://localhost:3001/api/photostudios')
      .then(response => {
        setStudios(response.data);
      })
      .catch(error => {
        console.error('Ошибка при загрузке данных:', error);
      });

    // Загрузка избранных фотостудий
    axios.get('http://localhost:3001/api/favourites', { withCredentials: true })
      .then(response => {
        // Сохраняем только studio_id для избранных фотостудий
        const studioIds = response.data
          .filter(fav => fav.type === 'photostudio' && fav.id)
          .map(fav => fav.id);
        setFavorites(studioIds);
      })
      .catch(error => {
        console.error('Ошибка при загрузке избранных фотостудий:', error);
      });
  }, []);

  const handleBookButtonClick = (studioName, address, price) => {
    navigate('/calendar', { state: { studio: studioName, address, price } });
  };

  const toggleFavorite = (studioId) => {
    if (favorites.includes(studioId)) {
      console.log('Удаление из избранного:', studioId);
      axios.delete(`http://localhost:3001/api/favourites/${studioId}`, { withCredentials: true })
        .then(() => {
          setFavorites(favorites.filter(id => id !== studioId));
          toast.info(`Фотостудия с ID ${studioId} удалена из избранного`);
        })
        .catch(error => {
          console.error('Ошибка при удалении из избранного:', error);
        });
    } else {
      console.log('Добавление в избранное:', studioId);
      axios.post('http://localhost:3001/api/favourites', { studio_id: studioId }, { withCredentials: true })
        .then(() => {
          setFavorites([...favorites, studioId]);
          toast.success(`Фотостудия с ID ${studioId} добавлена в избранное`);
        })
        .catch(error => {
          if (error.response && error.response.status === 400) {
            toast.warning(`Фотостудия с ID ${studioId} уже в избранном`);
          } else {
            console.error('Ошибка при добавлении в избранное:', error);
          }
        });
    }
  };

  // Фильтрация студий на основе строки поиска
  const filteredStudios = studios.filter((studio) =>
    studio.studio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Группировка карточек по 2 в ряд
  function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'transparent' }}>
      <div className="photostudios">
        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
        <h2>Фотостудии</h2>

        {/* Строка поиска */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Поиск по названию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="studio-list">
          {filteredStudios.length === 0 ? (
            <p>Нет доступных фотостудий</p>
          ) : (
            chunkArray(filteredStudios, 2).map((row, rowIdx) => (
              <div className="studio-row" key={rowIdx}>
                {row.map((studio) => (
                  <div key={studio.id} className="studio-card modern">
                    {studio.photo && studio.photo.startsWith('/src/components/assets/images/Photostudios/') ? (
                      <div
                        className="studio-image"
                        style={{
                          backgroundImage: `url(${studio.photo})`
                        }}
                      />
                    ) : (
                      <div className={`studio-image ${studio.photo || ''}`} />
                    )}
                    <div className="studio-info">
                      <div className="studio-main-info">
                        <h3>{studio.studio}</h3>
                        <p className="studio-address">{studio.address}</p>
                      </div>
                      <div className="studio-details-row">
                        <span className="studio-hours">{studio.opening_hours}</span>
                        <span className="studio-price">{studio.price}</span>
                      </div>
                      <div className="action-container modern">
                        <div className="studio-action-inner-grid">
                          <button
                            className="book-button modern"
                            onClick={() => handleBookButtonClick(studio.studio, studio.address, studio.price)}
                          >
                            Забронировать
                          </button>
                          <span
                            className={`studio-favorite-icon${favorites.includes(studio.id) ? ' favorite' : ''}`}
                            onClick={() => toggleFavorite(studio.id)}
                            title={favorites.includes(studio.id) ? 'Убрать из избранного' : 'В избранное'}
                          >
                            <img
                              src={favorites.includes(studio.id) ? BookedIcon : NotBookedIcon}
                              alt={favorites.includes(studio.id) ? 'В избранном' : 'В избранное'}
                            />
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

export default Photostudios;