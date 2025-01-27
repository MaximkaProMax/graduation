// src/components/Printing.js
import React from 'react';
import './Printing.css';
import Footer from './Footer';

function Printing() {
  return (
    <div className="printing">
      <main className="main-content">
        <h2>Типография</h2>
        <p>Заказывайте качественную полиграфию у нас.</p>
        <div className="printing-list">
          <div className="printing-card">
            <div className="printing-image layflat"></div>
            <div className="printing-info">
              <h3>LayFlat</h3>
              <p>Альбомы со сплошными разворотами. Плотные листы с толстой картонной основой или без нее + ламинация.</p>
              <p>Форматы: 20х30 / 23х23</p>
              <div className="action-container">
                <button className="order-button">Заказать</button>
                <span className="favorite-icon">❤️</span>
              </div>
            </div>
          </div>

          <div className="printing-card">
            <div className="printing-image flexbind"></div>
            <div className="printing-info">
              <h3>FlexBind</h3>
              <p>Альбомы с гибкими листами с раскрытием на 180° за счет специальной прорези посередине.</p>
              <p>Форматы: 20х30 / 23х23 / 30х23 / 30х30</p>
              <div className="action-container">
                <button className="order-button">Заказать</button>
                <span className="favorite-icon">❤️</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Printing;