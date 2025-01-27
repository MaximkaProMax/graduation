// src/components/Photostudios.js
import React from 'react';
import './Photostudios.css';

function Photostudios() {
  return (
    <div className="photostudios">
      <h2>Фотостудии</h2>
      <div className="studio-list">
        <div className="studio-card">
          <div className="studio-image replace"></div>
          <div className="studio-info">
            <h3>Зал Cozy в фотостудии Replace</h3>
            <p>г. Москва, большой Саввинский переулок 9С</p>
            <p>09:00 - 21:00</p>
            <p>2500₽</p>
            <div className="action-container">
              <button className="book-button">Забронировать</button>
              <span className="favorite-icon">❤️</span>
            </div>
          </div>
        </div>
        <div className="studio-card">
          <div className="studio-image apart"></div>
          <div className="studio-info">
            <h3>Зал APART в фотостудии PHOTO ZALL</h3>
            <p>г. Москва, ул. Академика Королева 13 стр1</p>
            <p>09:00 - 21:00</p>
            <p>1600₽</p>
            <div className="action-container">
              <button className="book-button">Забронировать</button>
              <span className="favorite-icon">❤️</span>
            </div>
          </div>
        </div>
        <div className="studio-card">
          <div className="studio-image hot-yellow"></div>
          <div className="studio-info">
            <h3>Зал Hot Yellow с песком и циклорамой</h3>
            <p>г. Москва, ул. Электрозаводская, 21, подъезд К</p>
            <p>09:00 - 21:00</p>
            <p>2200₽</p>
            <div className="action-container">
              <button className="book-button">Забронировать</button>
              <span className="favorite-icon">❤️</span>
            </div>
          </div>
        </div>
        <div className="studio-card">
          <div className="studio-image white-garden"></div>
          <div className="studio-info">
            <h3>Зал White Garden в фотостудии UNICORN STUDIOS</h3>
            <p>г. Москва, ул. Электрозаводская, 21, подъезд К</p>
            <p>09:00 - 21:00</p>
            <p>1600₽</p>
            <div className="action-container">
              <button className="book-button">Забронировать</button>
              <span className="favorite-icon">❤️</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Photostudios;