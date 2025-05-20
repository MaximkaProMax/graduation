import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PrintingLayFlat.css'; // Можно использовать общий стиль
import axios from 'axios';

const PrintingDynamic = () => {
  const { id } = useParams();
  const [printing, setPrinting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [spreads, setSpreads] = useState(2);
  const [quantity, setQuantity] = useState(1);
  const [selectedFormat, setSelectedFormat] = useState('');
  const [selectedBase, setSelectedBase] = useState('');
  const [selectedLamination, setSelectedLamination] = useState('');
  const [price, setPrice] = useState(0);
  const [spreadsError, setSpreadsError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/api/printing')
      .then(res => {
        // Поиск по id (число) или main_album_name (строка)
        let found = res.data.find(opt => String(opt.id) === id || opt.main_album_name === id);
        if (!found) {
          // fallback: поиск по main_album_name без учета регистра
          found = res.data.find(opt => opt.main_album_name?.toLowerCase() === id?.toLowerCase());
        }
        setPrinting(found);
        setLoading(false);
        if (found) {
          setSelectedFormat(Array.isArray(found.format) ? found.format[0] : '');
          setSelectedBase(found.basis_for_spread?.split(', ')[0] || '');
          let lamArr = [];
          if (Array.isArray(found.lamination)) {
            lamArr = found.lamination.flatMap(l => l.split('/').map(x => x.trim())).filter(Boolean);
          } else if (typeof found.lamination === 'string') {
            lamArr = found.lamination.split('/').map(l => l.trim()).filter(Boolean);
          }
          lamArr = [...new Set(lamArr)];
          setSelectedLamination(lamArr[0] || '');
          setPrice(
            (Number(found.price_of_spread) || 0) * 2 +
            (Number(found.copy_price) || 0) * 1
          );
        }
      });
  }, [id]);

  useEffect(() => {
    if (printing) {
      setPrice(
        (Number(printing.price_of_spread) || 0) * spreads +
        (Number(printing.copy_price) || 0) * quantity
      );
    }
  }, [spreads, quantity, printing]);

  // --- Бронирование ---
  const handleBooking = async () => {
    try {
      const bookingDetails = {
        format: selectedFormat,
        spreads: spreads,
        lamination: selectedLamination,
        quantity: quantity,
        price: price,
        albumName: printing.main_album_name,
      };

      // Отправляем бронирование на сервер
      const response = await axios.post('http://localhost:3001/api/bookings/add', bookingDetails, {
        withCredentials: true,
      });

      if (response.data.success) {
        alert('Бронирование успешно создано!');
      } else if (response.status === 403) {
        alert('Для бронирования необходимо авторизоваться!');
      } else {
        alert('Ошибка при создании бронирования');
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert('Для бронирования необходимо авторизоваться!');
      } else {
        console.error('Ошибка при бронировании:', error);
        alert('Ошибка при бронировании');
      }
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (!printing) return <div>Типография не найдена</div>;

  return (
    <div className="printing-layflat-page">
      <div className="printing-layflat-back-btn-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          Вернуться назад
        </button>
      </div>
      <div className="printing-layflat-content">
        <div className="left-section">
          {printing.main_card_photo && printing.main_card_photo.startsWith('/src/components/assets/images/Printing/') ? (
            <div
              className="layflat-image"
              style={{
                backgroundImage: `url(${printing.main_card_photo})`
              }}
            />
          ) : (
            <div className="layflat-image" />
          )}
          <div className="product-description">
            <h2>Описание товара</h2>
            <p>{printing.product_description}</p>
            <h2>Дополнительная информация</h2>
            <p>{printing.additional_information}</p>
          </div>
        </div>
        <div className="right-section">
          <h2>{printing.main_album_name}</h2>
          <div className="options">
            <div className="option">
              <label>Формат</label>
              <select value={selectedFormat} onChange={e => setSelectedFormat(e.target.value)}>
                {Array.isArray(printing.format) && printing.format.map((f, idx) => (
                  <option key={idx} value={f}>{f}</option>
                ))}
              </select>
            </div>
            {printing.basis_for_spread && (
              <div className="option">
                <label>Основа разворота</label>
                <select value={selectedBase} onChange={e => setSelectedBase(e.target.value)}>
                  {printing.basis_for_spread.split(',').map((b, idx) => (
                    <option key={idx} value={b.trim()}>{b.trim()}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="option">
              <label>Кол-во разворотов</label>
              <input
                type="number"
                value={spreads}
                min="2"
                max="25"
                onChange={e => {
                  const val = e.target.value;
                  if (val === '' || parseInt(val) >= 2) {
                    setSpreadsError('');
                    setSpreads(val);
                  } else {
                    setSpreadsError('Минимум 2 разворота');
                  }
                }}
              />
              {spreadsError && <div className="error">{spreadsError}</div>}
            </div>
            <div className="option">
              <label>Ламинация</label>
              <select value={selectedLamination} onChange={e => setSelectedLamination(e.target.value)}>
                {(() => {
                  let lamArr = [];
                  if (Array.isArray(printing.lamination)) {
                    lamArr = printing.lamination.flatMap(l => l.split('/').map(x => x.trim())).filter(Boolean);
                  } else if (typeof printing.lamination === 'string') {
                    lamArr = printing.lamination.split('/').map(l => l.trim()).filter(Boolean);
                  }
                  lamArr = [...new Set(lamArr)];
                  return lamArr.map((l, idx) => (
                    <option key={idx} value={l}>{l}</option>
                  ));
                })()}
              </select>
            </div>
            <div className="option">
              <label>Количество экземпляров</label>
              <input
                type="number"
                value={quantity}
                min="1"
                onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>
          </div>
          <div className="total-price">
            Итоговая цена: {isNaN(price) ? 'Укажите количество' : `${price}р`}
          </div>
          <button className="booking-button" onClick={handleBooking}>Забронировать</button>
        </div>
      </div>
    </div>
  );
};

export default PrintingDynamic;
