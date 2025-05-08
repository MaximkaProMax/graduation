import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Requests.css';
import { useNavigate } from 'react-router-dom';

const PhotoStudioRequests = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [studioBookings, setStudioBookings] = useState([]);
  const [editingStudio, setEditingStudio] = useState(null);
  const [newStudio, setNewStudio] = useState({
    studio_name: '', date: '', time: '', end_time: '', address: '', final_price: ''
  });
  const [selectedStudioId, setSelectedStudioId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/api/users/check-role', { withCredentials: true })
      .then(response => {
        if (response.data.success && (response.data.role === 'Admin' || response.data.role === 'Manager')) {
          setIsAuthorized(true);
        } else {
          navigate('/'); // Перенаправляем на главную, если роль не "Admin" или "Manager"
        }
      })
      .catch(() => {
        navigate('/'); // Перенаправляем на главную при ошибке
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [navigate]);

  useEffect(() => {
    fetchStudioRequests();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.requests-table') && !e.target.closest('.action-buttons')) {
        setSelectedStudioId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const fetchStudioRequests = async () => {
    try {
      const studioResponse = await axios.get('http://localhost:3001/api/bookings/studios/all', {
        withCredentials: true,
      });
      setStudioBookings(studioResponse.data.bookings);
    } catch (error) {
      console.error('Ошибка при загрузке заявок:', error);
    }
  };

  const handleDeleteStudio = async (id) => {
    if (!window.confirm('Удалить заявку?')) return;
    try {
      await axios.delete(`http://localhost:3001/api/bookings/studios/${id}`, { withCredentials: true });
      setStudioBookings(studioBookings.filter(b => b.booking_studio_id !== id));
    } catch (error) {
      alert('Ошибка при удалении');
    }
  };

  const handleEditStudio = (booking) => setEditingStudio({ ...booking });
  const handleStudioChange = (e) => setEditingStudio({ ...editingStudio, [e.target.name]: e.target.value });
  const handleSaveStudio = async () => {
    try {
      const timePattern = /^\d{2}:\d{2}(:\d{2})?$/;
      const normalizeTime = (val) => {
        if (!val) return '';
        if (/^\d{2}:\d{2}$/.test(val)) return val + ':00';
        return val;
      };
      if (!timePattern.test(editingStudio.time)) {
        alert('Время начала должно быть в формате HH:MM или HH:MM:SS');
        return;
      }
      if (editingStudio.end_time && !timePattern.test(editingStudio.end_time)) {
        alert('Время конца должно быть в формате HH:MM или HH:MM:SS');
        return;
      }
      const payload = {
        studio_name: editingStudio.studio_name,
        status: editingStudio.status || 'В обработке',
        date: editingStudio.date,
        time: normalizeTime(editingStudio.time),
        end_time: normalizeTime(editingStudio.end_time),
        address: editingStudio.address,
        final_price: editingStudio.final_price
      };
      await axios.put(
        `http://localhost:3001/api/bookings/studios/${editingStudio.booking_studio_id}`,
        payload,
        { withCredentials: true }
      );
      setEditingStudio(null);
      fetchStudioRequests();
    } catch (err) {
      alert('Ошибка при сохранении');
    }
  };

  const handleNewStudioChange = (e) => setNewStudio({ ...newStudio, [e.target.name]: e.target.value });
  const handleAddStudio = async (e) => {
    e.preventDefault();
    // Проверка типов
    if (!newStudio.studio_name.trim()) return alert('Название студии обязательно');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(newStudio.date)) return alert('Дата должна быть в формате YYYY-MM-DD');
    if (!/^\d{2}:\d{2}$/.test(newStudio.time)) return alert('Время начала должно быть в формате HH:MM');
    if (!/^\d{2}:\d{2}$/.test(newStudio.end_time)) return alert('Время конца должно быть в формате HH:MM');
    if (!newStudio.address.trim()) return alert('Адрес обязателен');
    if (isNaN(Number(newStudio.final_price))) return alert('Цена должна быть числом');
    const normalizeTime = (val) => {
      if (!val) return '';
      if (/^\d{2}:\d{2}$/.test(val)) return val + ':00';
      return val;
    };
    try {
      const payload = {
        name: newStudio.studio_name,
        date: newStudio.date,
        startTime: normalizeTime(newStudio.time),
        endTime: normalizeTime(newStudio.end_time),
        address: newStudio.address,
        totalCost: newStudio.final_price,
      };
      await axios.post('http://localhost:3001/api/bookings/studios/add', payload, { withCredentials: true });
      alert('Заявка на фотостудию успешно создана!');
      setNewStudio({ studio_name: '', date: '', time: '', end_time: '', address: '', final_price: '' });
      fetchStudioRequests();
    } catch (err) {
      alert('Ошибка при добавлении');
    }
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!isAuthorized) {
    return null; // Не отображаем ничего, если пользователь не авторизован
  }

  return (
    <div className="requests-container">
      <h2 className="requests-title" style={{ fontSize: 'clamp(18px, 4vw, 28px)' }}>Заказы на фотостудии</h2>
      <button className="back-button" style={{ margin: '16px 0 24px 0' }} onClick={() => navigate(-1)}>
        Вернуться назад
      </button>

      <h3 style={{ fontSize: 'clamp(16px, 3vw, 22px)' }}>Добавить заявку на фотостудию</h3>
      <form onSubmit={handleAddStudio} className="add-form">
        <input
          name="studio_name"
          value={newStudio.studio_name}
          onChange={handleNewStudioChange}
          placeholder="Название студии"
          required
          type="text"
          maxLength={255}
        />
        <input
          name="date"
          value={newStudio.date}
          onChange={handleNewStudioChange}
          placeholder="Дата (YYYY-MM-DD)"
          required
          type="date"
        />
        <input
          name="time"
          value={newStudio.time}
          onChange={handleNewStudioChange}
          placeholder="Время начала (HH:MM)"
          required
          type="time"
        />
        <input
          name="end_time"
          value={newStudio.end_time}
          onChange={handleNewStudioChange}
          placeholder="Время конца (HH:MM)"
          required
          type="time"
        />
        <input
          name="address"
          value={newStudio.address}
          onChange={handleNewStudioChange}
          placeholder="Адрес"
          required
          type="text"
        />
        <input
          name="final_price"
          value={newStudio.final_price}
          onChange={handleNewStudioChange}
          placeholder="Цена"
          required
          type="number"
          step="0.01"
        />
        <button type="submit">Добавить</button>
      </form>

      <h3 style={{ fontSize: 'clamp(16px, 3vw, 22px)' }}>Заказы на фотостудии</h3>
      <div className="table-container" style={{ maxWidth: '100vw', overflowX: 'auto' }}>
        <table className="requests-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Пользователь</th>
              <th>Название студии</th>
              <th>Статус</th>
              <th>Дата</th>
              <th>Время начала</th>
              <th>Время конца</th>
              <th>Адрес</th>
              <th>Итоговая цена</th>
              <th>Дата создания</th>
              <th>Дата обновления</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {studioBookings.map((booking) =>
              editingStudio && editingStudio.booking_studio_id === booking.booking_studio_id ? (
                <tr key={booking.booking_studio_id}>
                  <td>{booking.booking_studio_id}</td>
                  <td>{booking.user}</td>
                  <td><input name="studio_name" value={editingStudio.studio_name} onChange={handleStudioChange} /></td>
                  <td><input name="status" value={editingStudio.status} onChange={handleStudioChange} /></td>
                  <td><input name="date" value={editingStudio.date} onChange={handleStudioChange} /></td>
                  <td><input name="time" value={editingStudio.time} onChange={handleStudioChange} /></td>
                  <td><input name="end_time" value={editingStudio.end_time} onChange={handleStudioChange} /></td>
                  <td><input name="address" value={editingStudio.address} onChange={handleStudioChange} /></td>
                  <td><input name="final_price" value={editingStudio.final_price} onChange={handleStudioChange} /></td>
                  <td>{new Date(booking.created_at).toLocaleDateString()}</td>
                  <td>{new Date(booking.updated_at).toLocaleDateString()}</td>
                  <td>
                    <span style={{ color: "#888" }}>Редактируется</span>
                  </td>
                </tr>
              ) : (
                <tr
                  key={booking.booking_studio_id}
                  className={selectedStudioId === booking.booking_studio_id ? 'selected-row' : ''}
                  onClick={() => setSelectedStudioId(booking.booking_studio_id)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{booking.booking_studio_id}</td>
                  <td>{booking.user}</td>
                  <td>{booking.studio_name}</td>
                  <td>{booking.status}</td>
                  <td>{booking.date}</td>
                  <td>{booking.time}</td>
                  <td>{booking.end_time}</td>
                  <td>{booking.address}</td>
                  <td>{booking.final_price}</td>
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
        {selectedStudioId && !editingStudio && (
          <div className="action-buttons">
            <button onClick={() => handleEditStudio(studioBookings.find(b => b.booking_studio_id === selectedStudioId))}>
              Редактировать
            </button>
            <button onClick={() => handleDeleteStudio(selectedStudioId)}>
              Удалить
            </button>
          </div>
        )}
        {editingStudio && (
          <div className="action-buttons">
            <button onClick={handleSaveStudio}>Сохранить</button>
            <button onClick={() => setEditingStudio(null)}>Отмена</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoStudioRequests;
