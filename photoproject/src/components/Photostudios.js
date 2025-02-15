import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Photostudios.css';

function Photostudios() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [studios, setStudios] = useState([]);

  useEffect(() => {
    // Загрузка данных из API
    axios.get('http://localhost:3001/api/photostudios')
      .then(response => {
        console.log('Данные из API:', response.data); // Лог данных из API
        setStudios(response.data);
      })
      .catch(error => {
        console.error('Ошибка при загрузке данных:', error);
      });
  }, []);

  const handleBookButtonClick = () => {
    navigate('/calendar');
  };

  const toggleFavorite = (studioName) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(studioName)) {
        return prevFavorites.filter((name) => name !== studioName);
      } else {
        return [...prevFavorites, studioName];
      }
    });
  };

  return (
    <div className="photostudios">
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
                  <button className="book-button" onClick={handleBookButtonClick}>Забронировать</button>
                  <span
                    className={`favorite-icon ${favorites.includes(studio.studio) ? 'favorite' : ''}`}
                    onClick={() => toggleFavorite(studio.studio)}
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