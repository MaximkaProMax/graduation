import React, { useState, useEffect } from 'react';
import './PrintingFlexBind.css';

const PrintingFlexBind = () => {
  const [format, setFormat] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState('');
  const [spreads, setSpreads] = useState(4);
  const [lamination, setLamination] = useState([]);
  const [selectedLamination, setSelectedLamination] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [printingOptions, setPrintingOptions] = useState({});
  const [photoClass, setPhotoClass] = useState('');

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
          setSpreads(parseInt(flexBindOption.basis_for_spread.split(', ')[0]));
          setLamination(flexBindOption.lamination.split('/'));
          setPhotoClass(flexBindOption.photos_on_page[0]); // Устанавливаем класс изображения из массива
          setPrice(flexBindOption.price_of_spread * spreads + flexBindOption.copy_price * quantity);
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
    const value = parseInt(event.target.value);
    setSpreads(isNaN(value) ? '' : value);
  };

  const handleLaminationChange = (event) => {
    setSelectedLamination(event.target.value);
  };

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    setQuantity(isNaN(value) ? '' : value);
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
        <h2>Альбом FlexBind в фотообложке</h2> {/* Название альбома */}
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
              min="4"
              max="25"
              inputMode="numeric"
              onKeyPress={handleKeyPress}
            />
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