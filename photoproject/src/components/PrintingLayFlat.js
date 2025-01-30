import React, { useState } from 'react';
import './PrintingLayFlat.css';

const PrintingLayFlat = () => {
  const [format, setFormat] = useState('20x30');
  const [base, setBase] = useState('С основой');
  const [spreads, setSpreads] = useState(2);
  const [lamination, setLamination] = useState('Матовый');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(2024);

  const handleFormatChange = (event) => {
    setFormat(event.target.value);
  };

  const handleBaseChange = (event) => {
    setBase(event.target.value);
  };

  const handleSpreadsChange = (event) => {
    setSpreads(parseInt(event.target.value));
  };

  const handleLaminationChange = (event) => {
    setLamination(event.target.value);
  };

  const handleQuantityChange = (event) => {
    setQuantity(parseInt(event.target.value));
  };

  return (
    <div className="printing-layflat">
      <div className="left-section">
        <div className="layflat-image"></div> {/* Контейнер для изображения */}
        <div className="product-description">
          <h2>Описание товара</h2>
          <p>Твердая фотообложка на основе укрепленного картона. Доступны форматы: 20x30 / 23x23 / 23x30</p>
          <h2>Дополнительная информация</h2>
          <p>Обложка: крепкий картон толщиной 3 мм;<br />
            Варианты листов:<br />
            с основой — от 2 до 10 разворотов. Общая плотность листа 980 г/м², толщина ~1.15мм<br />
            без основы — от 5 до 15 разворотов. Общая плотность листа 650 г/м², толщина ~0.85мм<br />
            Цифровая печать Ricoh 9200 (флагман серии)<br />
            Ламинация снаружи и внутри (мат/глянец)
          </p>
        </div>
      </div>
      <div className="right-section">
        <h2>Альбом LayFlat в фотообложке</h2> {/* Название альбома */}
        <div className="options">
          <div className="option">
            <label>Формат</label>
            <select value={format} onChange={handleFormatChange}>
              <option value="20x30">20x30</option>
              <option value="23x23">23x23</option>
              <option value="23x30">23x30</option>
            </select>
          </div>
          <div className="option">
            <label>Основа разворота</label>
            <select value={base} onChange={handleBaseChange}>
              <option value="С основой">С основой</option>
              <option value="Без основы">Без основы</option>
            </select>
          </div>
          <div className="option">
            <label>Кол-во разворотов</label>
            <input type="number" value={spreads} onChange={handleSpreadsChange} min="2" max="15" />
          </div>
          <div className="option">
            <label>Ламинация</label>
            <select value={lamination} onChange={handleLaminationChange}>
              <option value="Матовый">Матовый</option>
              <option value="Глянцевый">Глянцевый</option>
            </select>
          </div>
          <div className="option">
            <label>Количество экземпляров</label>
            <input type="number" value={quantity} onChange={handleQuantityChange} min="1" />
          </div>
        </div>
        <div className="total-price">
          Итоговая цена: {price}р
        </div>
      </div>
    </div>
  );
};

export default PrintingLayFlat;