import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Printing.css';

const Printing = () => {
  const [printingOptions, setPrintingOptions] = useState([]);
  const [favorites, setFavorites] = useState([]); // Состояние для избранных типографий
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/printing');
        const data = await response.json();
        console.log('Полученные данные типографий:', data);

        if (Array.isArray(data)) {
          setPrintingOptions(data);
        } else {
          console.error('Полученные данные не являются массивом:', data);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных типографий:', error);
      }
    };

    const fetchFavorites = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/favourites', { withCredentials: true });
        console.log('Избранные типографии:', response.data);
        setFavorites(response.data.map(fav => fav.printing_id));
      } catch (error) {
        console.error('Ошибка при загрузке избранных типографий:', error);
      }
    };

    fetchData();
    fetchFavorites();
  }, []);

  const handleOrderClick = (option) => {
    if (option.main_album_name === 'LayFlat') {
      navigate('/printing-layflat');
    } else if (option.main_album_name === 'FlexBind') {
      navigate('/printing-flexbind');
    } else {
      console.log('Неизвестный тип печати:', option.main_album_name);
    }
  };

  const toggleFavorite = (printingId) => {
    if (favorites.includes(printingId)) {
      console.log('Удаление типографии из избранного:', printingId);
      axios.delete(`http://localhost:3001/api/favourites/${printingId}`, { withCredentials: true })
        .then(() => {
          setFavorites(favorites.filter(id => id !== printingId));
          toast.info(`Типография с ID ${printingId} удалена из избранного`);
        })
        .catch(error => {
          console.error('Ошибка при удалении типографии из избранного:', error);
        });
    } else {
      console.log('Добавление типографии в избранное:', printingId);
      axios.post('http://localhost:3001/api/favourites/printing', { printing_id: printingId }, { withCredentials: true })
        .then(() => {
          setFavorites([...favorites, printingId]);
          toast.success(`Типография с ID ${printingId} добавлена в избранное`);
        })
        .catch(error => {
          if (error.response && error.response.status === 400) {
            toast.warning(`Типография с ID ${printingId} уже в избранном`);
          } else {
            console.error('Ошибка при добавлении типографии в избранное:', error);
          }
        });
    }
  };

  const filteredPrintingOptions = printingOptions.filter((option) =>
    option.main_album_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="printing">
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
      <main className="main-content">
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
          {filteredPrintingOptions.length > 0 ? (
            filteredPrintingOptions.map((option, index) => (
              <div className="printing-card" key={index}>
                <div className={`printing-image ${option.main_card_photo}`}></div>
                <div className="printing-info">
                  <h3>{option.main_album_name}</h3>
                  <p>{option.main_card_description}</p>
                  <p>Форматы: {option.format ? option.format.join(' / ') : 'Не указано'}</p>
                  <div className="action-container">
                    <button className="order-button" onClick={() => handleOrderClick(option)}>Заказать</button>
                    <span
                      className={`favorite-icon ${favorites.includes(option.id) ? 'favorite' : ''}`}
                      onClick={() => toggleFavorite(option.id)}
                    >
                      ❤️
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Данные не найдены</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Printing;