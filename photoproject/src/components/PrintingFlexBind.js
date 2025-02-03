import React, { useState } from 'react';
import './PrintingFlexBind.css';

const PrintingFlexBind = () => {
  const [format, setFormat] = useState('20x30');
  const [spreads, setSpreads] = useState(2);
  const [lamination, setLamination] = useState('Матовый');
  const [quantity, setQuantity] = useState(1);
  const [price] = useState(1024); // Цена не изменяется, можно оставить без useState

  const handleFormatChange = (event) => {
    setFormat(event.target.value);
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
    <div className="printing-flexbind">
      <div className="left-section">
        <div className="flexbind-image"></div> {/* Контейнер для изображения */}
        <div className="product-description">
          <h2>Описание товара</h2>
          <p>Пожалуй, самый популярный вариант альбомов по технологии FlexBind. Доступны форматы: 20x30 / 23x23 / 23x30</p>
          <h2>Дополнительная информация</h2>
          <p>Твердая обложка с ламинацией;<br />
            Варианты листов:<br />
            с основой — от 4 до 25 разворотов (это 8-50 страниц);<br />
            Цифровая печать Ricoh 9200 (флагман серии);<br />
            Плотная бумага 250 г/м²;<br />
            Ламинация листов (мат/глянец);<br />
            Полное раскрытие на 180°, благодаря технологии FlexBind.
          </p>
        </div>
      </div>
      <div className="right-section">
        <h2>Альбом FlexBind в фотообложке</h2> {/* Название альбома */}
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
            <label>Кол-во разворотов</label>
            <input type="number" value={spreads} onChange={handleSpreadsChange} min="4" max="25" />
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

export default PrintingFlexBind;