import React, { useState, useEffect } from 'react';
import './PrintingFlexBind.css';

const PrintingFlexBind = () => {
  const [format, setFormat] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState('');
  const [spreads, setSpreads] = useState('2'); // Устанавливаем значение по умолчанию в 2
  const [lamination, setLamination] = useState([]);
  const [selectedLamination, setSelectedLamination] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState(0);
  const [printingOptions, setPrintingOptions] = useState({});
  const [photoClass, setPhotoClass] = useState('');
  const [albumName, setAlbumName] = useState(''); // Добавляем состояние для названия альбома
  const [spreadsError, setSpreadsError] = useState(''); // Добавляем состояние для ошибки количества разворотов

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/printing');
        const data = await response.json();
        console.log('Полученные данные:', data); // Лог полученных данных

        if (Array.isArray(data)) {
          const flexBindOption = data.find(option => option.id === 2);
          setPrintingOptions(flexBindOption);
          setFormat(flexBindOption.format);
          setSpreads('2'); // Устанавливаем значение по умолчанию в 2
          setLamination(flexBindOption.lamination.split('/'));
          setPhotoClass(flexBindOption.photos_on_page[0]); // Устанавливаем класс изображения из массива
          setPrice(flexBindOption.price_of_spread * 2 + flexBindOption.copy_price * 1);
          setAlbumName(flexBindOption.name_on_page); // Устанавливаем название альбома из базы данных
        } else {
          console.error('Полученные данные не являются массивом:', data);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (printingOptions.price_of_spread && printingOptions.copy_price) {
      setPrice(printingOptions.price_of_spread * spreads + printingOptions.copy_price * quantity);
    }
  }, [spreads, quantity, printingOptions]);

  const handleFormatChange = (event) => {
    setSelectedFormat(event.target.value);
  };

  const handleSpreadsChange = (event) => {
    const value = event.target.value;
    if (value === '' || parseInt(value) >= 2) {
      setSpreadsError('');
      setSpreads(value);
    } else {
      setSpreadsError('Количество разворотов минимум 2 штуки');
    }
  };

  const handleLaminationChange = (event) => {
    setSelectedLamination(event.target.value);
  };

  const handleQuantityChange = (event) => {
    const value = event.target.value;
    setQuantity(value === '' ? '' : Math.max(1, parseInt(value)));
  };

  const handleKeyPress = (event) => {
    const charCode = event.charCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  };

  return (
    <div className="printing-flexbind">
      <div className="left-section">
        <div className={`flexbind-image ${photoClass}`}></div> {/* Используем класс для отображения изображения */}
        <div className="product-description">
          <h2>Описание товара</h2>
          <p>{printingOptions.product_description}</p>
          <h2>Дополнительная информация</h2>
          <p>{printingOptions.additional_information}</p>
        </div>
      </div>
      <div className="right-section">
        <h2>{albumName}</h2> {/* Название альбома из базы данных */}
        <div className="options">
          <div className="option">
            <label>Формат</label>
            <select value={selectedFormat} onChange={handleFormatChange}>
              {format.map((f, index) => (
                <option key={index} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div className="option">
            <label>Кол-во разворотов</label>
            <input
              type="number"
              value={spreads}
              onChange={handleSpreadsChange}
              min="2"
              max="25"
              inputMode="numeric"
              onKeyPress={handleKeyPress}
            />
            {spreadsError && <div className="error">{spreadsError}</div>}
          </div>
          <div className="option">
            <label>Ламинация</label>
            <select value={selectedLamination} onChange={handleLaminationChange}>
              {lamination.map((l, index) => (
                <option key={index} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <div className="option">
            <label>Количество экземпляров</label>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              inputMode="numeric"
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>
        <div className="total-price">
          Итоговая цена: {isNaN(price) ? 'Укажите количество' : `${price}р`}
        </div>
      </div>
    </div>
  );
};

export default PrintingFlexBind;