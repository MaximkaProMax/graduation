import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Requests.css';
import { useNavigate } from 'react-router-dom';

const PrintingHouseRequests = () => {
  const [typographyBookings, setTypographyBookings] = useState([]);
  const [editingTypography, setEditingTypography] = useState(null);
  const [newTypography, setNewTypography] = useState({
    format: '', the_basis_of_the_spread: '', number_of_spreads: '', lamination: '', number_of_copies: '', address_delivery: '', final_price: '', album_name: ''
  });
  const [selectedTypographyId, setSelectedTypographyId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTypographyRequests();
  }, []);

  const fetchTypographyRequests = async () => {
    try {
      const typographyResponse = await axios.get('http://localhost:3001/api/bookings/typography/all', {
        withCredentials: true,
      });
      setTypographyBookings(typographyResponse.data.bookings);
    } catch (error) {
      console.error('Ошибка при загрузке заявок:', error);
    }
  };

  const handleDeleteTypography = async (id) => {
    if (!window.confirm('Удалить заявку?')) return;
    try {
      await axios.delete(`http://localhost:3001/api/bookings/typography/${id}`, { withCredentials: true });
      setTypographyBookings(typographyBookings.filter(b => b.booking_typographie_id !== id));
    } catch (error) {
      alert('Ошибка при удалении');
    }
  };

  const handleEditTypography = (booking) => setEditingTypography({ ...booking });
  const handleTypographyChange = (e) => setEditingTypography({ ...editingTypography, [e.target.name]: e.target.value });
  const handleSaveTypography = async () => {
    try {
      await axios.put(`http://localhost:3001/api/bookings/typography/${editingTypography.booking_typographie_id}`, editingTypography, { withCredentials: true });
      setEditingTypography(null);
      fetchTypographyRequests();
    } catch {
      alert('Ошибка при сохранении');
    }
  };

  const handleNewTypographyChange = (e) => setNewTypography({ ...newTypography, [e.target.name]: e.target.value });
  const handleAddTypography = async (e) => {
    e.preventDefault();
    if (!newTypography.format.trim()) return alert('Формат обязателен');
    if (newTypography.the_basis_of_the_spread && typeof newTypography.the_basis_of_the_spread !== 'string') return alert('Основа разворота должна быть строкой');
    if (!/^\d+$/.test(newTypography.number_of_spreads)) return alert('Кол-во разворотов должно быть целым числом');
    if (!newTypography.lamination.trim()) return alert('Ламинация обязательна');
    if (!/^\d+$/.test(newTypography.number_of_copies)) return alert('Кол-во копий должно быть целым числом');
    if (newTypography.address_delivery && typeof newTypography.address_delivery !== 'string') return alert('Адрес доставки должен быть строкой');
    if (isNaN(Number(newTypography.final_price))) return alert('Цена должна быть числом');
    if (!newTypography.album_name.trim()) return alert('Название альбома обязательно');
    try {
      const payload = {
        format: newTypography.format,
        spreads: newTypography.number_of_spreads,
        lamination: newTypography.lamination,
        quantity: newTypography.number_of_copies,
        price: newTypography.final_price,
        albumName: newTypography.album_name,
      };
      await axios.post('http://localhost:3001/api/bookings/add', payload, { withCredentials: true });
      alert('Заявка на типографию успешно создана!');
      setNewTypography({ format: '', the_basis_of_the_spread: '', number_of_spreads: '', lamination: '', number_of_copies: '', address_delivery: '', final_price: '', album_name: '' });
      fetchTypographyRequests();
    } catch (err) {
      alert('Ошибка при добавлении');
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.requests-table') && !e.target.closest('.action-buttons')) {
        setSelectedTypographyId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="requests-container">
      <h2 className="requests-title" style={{ fontSize: 'clamp(18px, 4vw, 28px)' }}>Заказы на типографию</h2>
      <button className="back-button" style={{ margin: '16px 0 24px 0' }} onClick={() => navigate(-1)}>
        Вернуться назад
      </button>

      <h3 style={{ fontSize: 'clamp(16px, 3vw, 22px)' }}>Добавить заявку на типографию</h3>
      <form onSubmit={handleAddTypography} className="add-form">
        <input
          name="format"
          value={newTypography.format}
          onChange={handleNewTypographyChange}
          placeholder="Формат"
          required
          type="text"
          maxLength={50}
        />
        <input
          name="the_basis_of_the_spread"
          value={newTypography.the_basis_of_the_spread}
          onChange={handleNewTypographyChange}
          placeholder="Основа разворота"
          type="text"
          maxLength={100}
        />
        <input
          name="number_of_spreads"
          value={newTypography.number_of_spreads}
          onChange={handleNewTypographyChange}
          placeholder="Кол-во разворотов"
          required
          type="number"
          min="1"
          step="1"
        />
        <input
          name="lamination"
          value={newTypography.lamination}
          onChange={handleNewTypographyChange}
          placeholder="Ламинация"
          required
          type="text"
          maxLength={50}
        />
        <input
          name="number_of_copies"
          value={newTypography.number_of_copies}
          onChange={handleNewTypographyChange}
          placeholder="Кол-во копий"
          required
          type="number"
          min="1"
          step="1"
        />
        <input
          name="address_delivery"
          value={newTypography.address_delivery}
          onChange={handleNewTypographyChange}
          placeholder="Адрес доставки"
          type="text"
        />
        <input
          name="final_price"
          value={newTypography.final_price}
          onChange={handleNewTypographyChange}
          placeholder="Цена"
          required
          type="number"
          step="0.01"
        />
        <input
          name="album_name"
          value={newTypography.album_name}
          onChange={handleNewTypographyChange}
          placeholder="Название альбома"
          required
          type="text"
          maxLength={255}
        />
        <button type="submit">Добавить</button>
      </form>

      <div className="table-container" style={{ maxWidth: '100vw', overflowX: 'auto' }}>
        <table className="requests-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Пользователь</th>
              <th>Статус</th>
              <th>Формат</th>
              <th>Основа разворота</th>
              <th>Количество разворотов</th>
              <th>Ламинация</th>
              <th>Количество копий</th>
              <th>Адрес доставки</th>
              <th>Итоговая цена</th>
              <th>Название альбома</th>
              <th>Дата создания</th>
              <th>Дата обновления</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {typographyBookings.map((booking) =>
              editingTypography && editingTypography.booking_typographie_id === booking.booking_typographie_id ? (
                <tr key={booking.booking_typographie_id}>
                  <td>{booking.booking_typographie_id}</td>
                  <td>{booking.user}</td>
                  <td><input name="status" value={editingTypography.status} onChange={handleTypographyChange} /></td>
                  <td><input name="format" value={editingTypography.format} onChange={handleTypographyChange} /></td>
                  <td><input name="the_basis_of_the_spread" value={editingTypography.the_basis_of_the_spread} onChange={handleTypographyChange} /></td>
                  <td><input name="number_of_spreads" value={editingTypography.number_of_spreads} onChange={handleTypographyChange} /></td>
                  <td><input name="lamination" value={editingTypography.lamination} onChange={handleTypographyChange} /></td>
                  <td><input name="number_of_copies" value={editingTypography.number_of_copies} onChange={handleTypographyChange} /></td>
                  <td><input name="address_delivery" value={editingTypography.address_delivery} onChange={handleTypographyChange} /></td>
                  <td><input name="final_price" value={editingTypography.final_price} onChange={handleTypographyChange} /></td>
                  <td><input name="album_name" value={editingTypography.album_name} onChange={handleTypographyChange} /></td>
                  <td>{new Date(booking.created_at).toLocaleDateString()}</td>
                  <td>{new Date(booking.updated_at).toLocaleDateString()}</td>
                  <td>
                    <span style={{ color: "#888" }}>Редактируется</span>
                  </td>
                </tr>
              ) : (
                <tr
                  key={booking.booking_typographie_id}
                  className={selectedTypographyId === booking.booking_typographie_id ? 'selected-row' : ''}
                  onClick={() => setSelectedTypographyId(booking.booking_typographie_id)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{booking.booking_typographie_id}</td>
                  <td>{booking.user}</td>
                  <td>{booking.status}</td>
                  <td>{booking.format}</td>
                  <td>{booking.the_basis_of_the_spread}</td>
                  <td>{booking.number_of_spreads}</td>
                  <td>{booking.lamination}</td>
                  <td>{booking.number_of_copies}</td>
                  <td>{booking.address_delivery}</td>
                  <td>{booking.final_price}</td>
                  <td>{booking.album_name}</td>
                  <td>{new Date(booking.created_at).toLocaleDateString()}</td>
                  <td>{new Date(booking.updated_at).toLocaleDateString()}</td>
                  <td>
                    {/* Пусто, кнопки вынесены вниз */}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
        {selectedTypographyId && !editingTypography && (
          <div className="action-buttons">
            <button onClick={() => handleEditTypography(typographyBookings.find(b => b.booking_typographie_id === selectedTypographyId))}>
              Редактировать
            </button>
            <button onClick={() => handleDeleteTypography(selectedTypographyId)}>
              Удалить
            </button>
          </div>
        )}
        {editingTypography && (
          <div className="action-buttons">
            <button onClick={handleSaveTypography}>Сохранить</button>
            <button onClick={() => setEditingTypography(null)}>Отмена</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrintingHouseRequests;
