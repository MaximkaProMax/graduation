import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/Printing.css';
import BookedIcon from './assets/images/Favourites/Booked.svg';
import NotBookedIcon from './assets/images/Favourites/NotBooked.svg';

const Printing = () => {
  const [printingOptions, setPrintingOptions] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/printing');
        const data = await response.json();
        if (Array.isArray(data)) {
          setPrintingOptions(data);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных типографий:', error);
      }
    };

    const fetchFavorites = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/favourites', { withCredentials: true });
        // Оставляем только избранные типографии
        const printingIds = response.data
          .filter(fav => fav.type === 'printing' && fav.id)
          .map(fav => fav.id);
        setFavorites(printingIds);
      } catch (error) {
        console.error('Ошибка при загрузке избранных типографий:', error);
      }
    };

    fetchData();
    fetchFavorites();
  }, []);

  const handleOrderClick = (option) => {
    navigate(`/printing/${option.id}`);
  };

  const toggleFavorite = (printingId) => {
    if (favorites.includes(printingId)) {
      axios.delete(`http://localhost:3001/api/favourites/printing/${printingId}`, { withCredentials: true })
        .then(() => {
          setFavorites(favorites.filter(id => id !== printingId));
          toast.info(`Типография с ID ${printingId} удалена из избранного`);
        })
        .catch(error => {
          console.error('Ошибка при удалении типографии из избранного:', error);
        });
    } else {
      axios.post('http://localhost:3001/api/favourites/printing', { printing_id: printingId }, { withCredentials: true })
        .then(() => {
          setFavorites([...favorites, printingId]);
          toast.success(`Типография с ID ${printingId} добавлена в избранное`);
        })
        .catch(error => {
          if (error.response && error.response.status === 400) {
            toast.warning(`Типография с ID ${printingId} уже в избранном`);
          }
        });
    }
  };

  const filteredPrintingOptions = printingOptions.filter((option) =>
    option.main_album_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'transparent' }}>
      <div className="printing printing-modern">
        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
        <h2>Типография</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Поиск по названию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="printing-list">
          {filteredPrintingOptions.length === 0 ? (
            <p>Данные не найдены</p>
          ) : (
            chunkArray(filteredPrintingOptions, 2).map((row, rowIdx) => (
              <div className="printing-row" key={rowIdx}>
                {row.map((option) => (
                  <div key={option.id} className="printing-card modern">
                    {option.main_card_photo && option.main_card_photo.startsWith('/src/components/assets/images/Printing/') ? (
                      <div
                        className="printing-image"
                        style={{
                          backgroundImage: `url(${option.main_card_photo})`
                        }}
                      />
                    ) : (
                      <div className={`printing-image ${option.main_card_photo || ''}`} />
                    )}
                    <div className="printing-info">
                      <div className="printing-main-info">
                        <h3>{option.main_album_name}</h3>
                        <p className="printing-description">{option.main_card_description}</p>
                      </div>
                      <div className="printing-details-row">
                        <span className="printing-formats">
                          {option.format ? option.format.join(' / ') : 'Не указано'}
                        </span>
                        {/* Показывать цену только если она есть */}
                        {option.price && (
                          <span className="printing-price">{option.price}₽</span>
                        )}
                      </div>
                      <div className="action-container modern">
                        <div className="action-inner-grid">
                          <button
                            className="order-button modern"
                            onClick={() => handleOrderClick(option)}
                          >
                            Заказать
                          </button>
                          <span
                            className={`favorite-icon modern${favorites.includes(option.id) ? ' favorite' : ''}`}
                            onClick={() => toggleFavorite(option.id)}
                            title={favorites.includes(option.id) ? 'Убрать из избранного' : 'В избранное'}
                          >
                            <img
                              src={favorites.includes(option.id) ? BookedIcon : NotBookedIcon}
                              alt={favorites.includes(option.id) ? 'В избранном' : 'В избранное'}
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
};

export default Printing;