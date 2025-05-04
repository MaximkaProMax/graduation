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
          console.log('Избранные фотостудии:', response.data);
          setFavorites(response.data);
        })
        .catch(error => {
          console.error('Ошибка при загрузке избранных фотостудий:', error);
        });
    }
  }, [isAuthenticated]);

  const handleBookButtonClick = (studioName, address) => {
    navigate('/calendar', { state: { studio: studioName, address } });
  };

  const handleRemoveFavorite = (studioId) => {
    console.log('Удаление из избранного:', studioId);
    axios.delete(`http://localhost:3001/api/favourites/${studioId}`, { withCredentials: true })
      .then(() => {
        setFavorites(favorites.filter(fav => fav.id !== studioId));
        toast.info(`Фотостудия с ID ${studioId} удалена из избранного`);
      })
      .catch(error => {
        console.error('Ошибка при удалении из избранного:', error);
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

  return (
    <div className="favourites">
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
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
                  <span
                    className="remove-icon"
                    onClick={() => handleRemoveFavorite(fav.id)}
                  >
                    ❌
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

export default Favourites;