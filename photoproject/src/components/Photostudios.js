import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Photostudios.css';

function Photostudios() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);

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
        {[
          {
            name: 'Зал Cozy в фотостудии Replace',
            address: 'г. Москва, большой Саввинский переулок 9С',
            hours: '09:00 - 21:00',
            price: '2500₽',
            imageClass: 'replace'
          },
          {
            name: 'Зал APART в фотостудии PHOTO ZALL',
            address: 'г. Москва, ул. Академика Королева 13 стр1',
            hours: '09:00 - 21:00',
            price: '1600₽',
            imageClass: 'apart'
          },
          {
            name: 'Зал Hot Yellow с песком и циклорамой',
            address: 'г. Москва, ул. Электрозаводская, 21, подъезд К',
            hours: '09:00 - 21:00',
            price: '2200₽',
            imageClass: 'hot-yellow'
          },
          {
            name: 'Зал White Garden в фотостудии UNICORN STUDIOS',
            address: 'г. Москва, ул. Электрозаводская, 21, подъезд К',
            hours: '09:00 - 21:00',
            price: '1600₽',
            imageClass: 'white-garden'
          }
        ].map((studio) => (
          <div key={studio.name} className="studio-card">
            <div className={`studio-image ${studio.imageClass}`}></div>
            <div className="studio-info">
              <h3>{studio.name}</h3>
              <p>{studio.address}</p>
              <p>{studio.hours}</p>
              <p>{studio.price}</p>
              <div className="action-container">
                <button className="book-button" onClick={handleBookButtonClick}>Забронировать</button>
                <span
                  className={`favorite-icon ${favorites.includes(studio.name) ? 'favorite' : ''}`}
                  onClick={() => toggleFavorite(studio.name)}
                >
                  ❤️
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Photostudios;