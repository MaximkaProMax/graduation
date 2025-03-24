import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Photostudios.css';

function Photostudios() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [studios, setStudios] = useState([]);

  useEffect(() => {
    // Загрузка данных из API
    axios.get('http://localhost:3001/api/photostudios')
      .then(response => {
        console.log('Данные фотостудий:', response.data);
        setStudios(response.data);
      })
      .catch(error => {
        console.error('Ошибка при загрузке данных:', error);
      });

    // Загрузка избранных фотостудий
    axios.get('http://localhost:3001/api/favourites', { withCredentials: true })
      .then(response => {
        console.log('Избранные фотостудии:', response.data);
        setFavorites(response.data.map(fav => fav.studio_id));
      })
      .catch(error => {
        console.error('Ошибка при загрузке избранных фотостудий:', error);
      });
  }, []);

  const handleBookButtonClick = (studioName, address) => {
    navigate('/calendar', { state: { studio: studioName, address } });
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

  return (
    <div className="photostudios">
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
      <h2>Фотостудии</h2>
      <div className="studio-list">
        {studios.length === 0 ? (
          <p>Нет доступных фотостудий</p>
        ) : (
          studios.map((studio) => (
            <div key={studio.id} className="studio-card">
              <div className={`studio-image ${studio.photo}`}></div>
              <div className="studio-info">
                <h3>{studio.studio}</h3>
                <p>{studio.address}</p>
                <p>{studio.opening_hours}</p>
                <p>{studio.price}</p>
                <div className="action-container">
                  <button
                    className="book-button"
                    onClick={() => handleBookButtonClick(studio.studio, studio.address)}
                  >
                    Забронировать
                  </button>
                  <span
                    className={`favorite-icon ${favorites.includes(studio.id) ? 'favorite' : ''}`}
                    onClick={() => toggleFavorite(studio.id)}
                  >
                    ❤️
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Photostudios;