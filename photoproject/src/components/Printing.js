import React, { useState, useEffect } from 'react';
import './Printing.css';

const Printing = () => {
  const [printingOptions, setPrintingOptions] = useState([]);

  useEffect(() => {
    // В реальном приложении данные будут получены из базы данных
    const fetchData = async () => {
      const data = [
        {
          name: 'LayFlat',
          description: 'Альбомы со сплошными разворотами. Плотные листы с толстой картонной основой или без нее + ламинация.',
          formats: ['20х30', '23х23'],
          imageClass: 'layflat'
        },
        {
          name: 'FlexBind',
          description: 'Альбомы с гибкими листами с раскрытием на 180° за счет специальной прорези посередине.',
          formats: ['20х30', '23х23', '30х23', '30х30'],
          imageClass: 'flexbind'
        },
      ];
      setPrintingOptions(data);
    };

    fetchData();
  }, []);

  return (
    <div className="printing">
      <main className="main-content">
        <h2>Типография</h2>
        <p>Заказывайте качественную полиграфию у нас.</p>
        <div className="printing-list">
          {printingOptions.map((option, index) => (
            <div className="printing-card" key={index}>
              <div className={`printing-image ${option.imageClass}`}></div>
              <div className="printing-info">
                <h3>{option.name}</h3>
                <p>{option.description}</p>
                <p>Форматы: {option.formats.join(' / ')}</p>
                <div className="action-container">
                  <button className="order-button">Заказать</button>
                  <span className="favorite-icon">❤️</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Printing;