import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Favourites.css';

function Favourites() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/favourites')
      .then(response => {
        console.log('Избранные фотостудии:', response.data);
        setFavorites(response.data.map(fav => fav.photostudio));
      })
      .catch(error => {
        console.error('Ошибка при загрузке избранных фотостудий:', error);
      });
  }, []);

  const handleBookButtonClick = (studioName, address) => {
    navigate('/calendar', { state: { studio: studioName, address } });
  };

  return (
    <div className="photostudios">
      <h2>Избранные фотостудии</h2>
      <div className="studio-list">
        {favorites.length === 0 ? (
          <p>Нет избранных фотостудий</p>
        ) : (
          favorites.map((fav) => (
            <div key={fav.id} className="studio-card">
              <div className={`studio-image ${fav.photo}`}></div>
              <div className="studio-info">
                <h3>{fav.studio}</h3>
                <p>{fav.address}</p>
                <p>{fav.opening_hours}</p>
                <p>{fav.price}</p>
                <div className="action-container">
                  <button
                    className="book-button"
                    onClick={() => handleBookButtonClick(fav.studio, fav.address)}
                  >
                    Забронировать
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Favourites;