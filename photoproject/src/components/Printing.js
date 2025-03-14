import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Printing.css';

const Printing = () => {
  const [printingOptions, setPrintingOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // В реальном приложении данные будут получены из базы данных
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/printing');
        const data = await response.json();
        console.log('Полученные данные:', data); // Лог полученных данных

        if (Array.isArray(data)) {
          setPrintingOptions(data);
        } else {
          console.error('Полученные данные не являются массивом:', data);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    fetchData();
  }, []);

  const handleOrderClick = (option) => {
    if (option.main_album_name === 'LayFlat') {
      navigate('/printing-layflat');
    } else if (option.main_album_name === 'FlexBind') {
      navigate('/printing-flexbind');
    } else {
      // Другие действия для других типов печати
    }
  };

  return (
    <div className="printing">
      <main className="main-content">
        <h2>Типография</h2>
        <p>Заказывайте качественную полиграфию у нас.</p>
        <div className="printing-list">
          {printingOptions.length > 0 ? (
            printingOptions.map((option, index) => (
              <div className="printing-card" key={index}>
                <div className={`printing-image ${option.main_card_photo}`}></div>
                <div className="printing-info">
                  <h3>{option.main_album_name}</h3>
                  <p>{option.main_card_description}</p>
                  <p>Форматы: {option.format ? option.format.join(' / ') : 'Не указано'}</p>
                  <div className="action-container">
                    <button className="order-button" onClick={() => handleOrderClick(option)}>Заказать</button>
                    <span className="favorite-icon">❤️</span>
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