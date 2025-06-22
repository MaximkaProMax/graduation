import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Requests.css';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal'; // Добавляем модальное окно

const STUDIO_STATUSES = [
  "Запрос брони",
  "Подтверждено",
  "Оплачено",
  "Ожидает начала",
  "В процессе",
  "Завершено",
  "Отменено",
  "Перенесено",
  "Неявка"
];

const MIN_HOUR = 9;
const MAX_HOUR = 21;

const PhotoStudioRequests = () => {
  const [studioBookings, setStudioBookings] = useState([]);
  const [editingStudio, setEditingStudio] = useState(null);
  const [newStudio, setNewStudio] = useState({
    user_id: '', studio_name: '', date: '', time: '', end_time: '', address: '', final_price: ''
  });
  const [selectedStudioId, setSelectedStudioId] = useState(null);
  const [users, setUsers] = useState([]);
  const [studiosList, setStudiosList] = useState([]);
  const [studioBookedIntervals, setStudioBookedIntervals] = useState([]);
  const [dateError, setDateError] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/api/users/check-role', { withCredentials: true })
      .then(response => {
        if (response.data.success && (response.data.role === 'Admin' || response.data.role === 'Manager')) {
          setIsAuthorized(true);
          fetchStudioRequests();
        } else {
          navigate('/');
        }
      })
      .catch(() => {
        navigate('/');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [navigate]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/users', { withCredentials: true })
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]));
  }, []);

  useEffect(() => {
    axios.get('http://localhost:3001/api/photostudios')
      .then(res => setStudiosList(res.data))
      .catch(() => setStudiosList([]));
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

  // Получение занятых интервалов для выбранной студии, даты и адреса
  useEffect(() => {
    const studioObj = studiosList.find(s => s.studio === newStudio.studio_name);
    if (!newStudio.studio_name || !newStudio.date || !studioObj) {
      setStudioBookedIntervals([]);
      return;
    }
    axios.get('http://localhost:3001/api/bookings/studios/booked', {
      params: {
        name: newStudio.studio_name,
        date: newStudio.date,
        address: studioObj.address
      },
      withCredentials: true
    })
      .then(res => {
        if (res.data.success) {
          setStudioBookedIntervals(
            res.data.bookings.map(b => {
              const [start, end] = (b.time || '').split('-');
              return { start, end };
            })
          );
        } else {
          setStudioBookedIntervals([]);
        }
      })
      .catch(() => setStudioBookedIntervals([]));
  }, [newStudio.studio_name, newStudio.date, studiosList]);

  // Автоматически подставлять адрес и цену при выборе студии
  useEffect(() => {
    const studioObj = studiosList.find(s => s.studio === newStudio.studio_name);
    if (studioObj) {
      setNewStudio(ns => ({
        ...ns,
        address: studioObj.address,
        price_per_hour: studioObj.price
      }));
    }
  }, [newStudio.studio_name, studiosList]);

  // Автоматический расчет итоговой стоимости для студии
  useEffect(() => {
    const studioObj = studiosList.find(s => s.studio === newStudio.studio_name);
    if (!studioObj) {
      setNewStudio(ns => ({ ...ns, final_price: '' }));
      return;
    }
    const pricePerHour = parseFloat(studioObj.price.replace(/[^\d.-]/g, '')) || 0;
    if (newStudio.time && newStudio.end_time) {
      const [startHour] = (newStudio.time || '').split(':').map(Number);
      const [endHour] = (newStudio.end_time || '').split(':').map(Number);
      const hours = endHour - startHour;
      const total = hours > 0 ? hours * pricePerHour : 0;
      setNewStudio(ns => ({ ...ns, final_price: total }));
    } else {
      setNewStudio(ns => ({ ...ns, final_price: '' }));
    }
  }, [newStudio.studio_name, newStudio.time, newStudio.end_time, studiosList]);

  // Проверка на пересечение с занятыми интервалами
  const isStudioIntervalBusy = () => {
    if (!newStudio.time || !newStudio.end_time) return false;
    const start = newStudio.time;
    const end = newStudio.end_time;
    return studioBookedIntervals.some(b => start < b.end && end > b.start);
  };

  // Генерация опций времени с учётом занятых интервалов
  const generateTimeOptions = (start, end, isEnd = false) => {
    const options = [];
    for (let hour = start; hour <= end; hour++) {
      const time = `${String(hour).padStart(2, '0')}:00`;
      let disabled = false;
      if (!isEnd && studioBookedIntervals.some(b => time >= b.start && time < b.end)) {
        disabled = true;
      }
      if (isEnd && studioBookedIntervals.some(b => time > b.start && time <= b.end)) {
        disabled = true;
      }
      options.push(
        <option key={time} value={time} disabled={disabled}>
          {time}{disabled ? ' (занято)' : ''}
        </option>
      );
    }
    return options;
  };

  // Валидация даты для поля "date"
  const validateDate = (dateStr) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
    const [year, month, day] = dateStr.split('-').map(Number);
    if (year < 1900 || year > 2100) return false;
    const d = new Date(dateStr);
    return d && d.getFullYear() === year && d.getMonth() + 1 === month && d.getDate() === day;
  };

  const todayStr = React.useMemo(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }, []);

  const handleNewStudioChange = (e) => {
    const { name, value } = e.target;
    if (name === "date") {
      if (value.length === 10 && !validateDate(value)) {
        setDateError('Некорректная дата');
      } else {
        setDateError('');
      }
    }
    // Автозаполнение адреса при смене студии
    if (name === "studio_name") {
      const studioObj = studiosList.find(s => s.studio === value);
      setNewStudio({ ...newStudio, [name]: value, address: studioObj ? studioObj.address : '' });
    } else {
      setNewStudio({ ...newStudio, [name]: value });
    }
  };

  const handleAddStudio = async (e) => {
    e.preventDefault();
    if (!newStudio.user_id) return toast.error('Выберите пользователя');
    if (!newStudio.studio_name.trim()) return toast.error('Название студии обязательно');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(newStudio.date)) return toast.error('Дата должна быть в формате YYYY-MM-DD');
    if (!/^\d{2}:\d{2}$/.test(newStudio.time)) return toast.error('Время начала должно быть в формате HH:MM');
    if (!/^\d{2}:\d{2}$/.test(newStudio.end_time)) return toast.error('Время конца должно быть в формате HH:MM');
    if (!newStudio.address.trim()) return toast.error('Адрес обязателен');
    if (isNaN(Number(newStudio.final_price))) return toast.error('Цена должна быть числом');
    if (!newStudio.date) return toast.error('Выберите дату');
    if (!newStudio.time || !newStudio.end_time) return toast.error('Выберите время');
    if (isStudioIntervalBusy()) return toast.error('Выбранное время уже занято!');
    const normalizeTime = (val) => {
      if (!val) return '';
      if (/^\d{2}:\d{2}$/.test(val)) return val + ':00';
      return val;
    };
    try {
      const payload = {
        user_id: newStudio.user_id,
        name: newStudio.studio_name,
        date: newStudio.date,
        time: `${newStudio.time}-${newStudio.end_time}`,
        address: newStudio.address,
        totalCost: newStudio.final_price,
      };
      await axios.post('http://localhost:3001/api/bookings/studios/add', payload, { withCredentials: true });
      toast.success('Заявка на фотостудию успешно создана!');
      setNewStudio({ user_id: '', studio_name: '', date: '', time: '', end_time: '', address: '', final_price: '' });
      fetchStudioRequests();
    } catch (err) {
      toast.error('Ошибка при добавлении');
    }
  };

  const handleEditStudio = (booking) => setEditingStudio({ ...booking });
  const handleStudioChange = (e) => {
    const { name, value } = e.target;
    // Если меняется студия — автоматически подставляем адрес
    if (name === "studio_name") {
      const studioObj = studiosList.find(s => s.studio === value);
      setEditingStudio({
        ...editingStudio,
        studio_name: value,
        address: studioObj ? studioObj.address : ''
      });
    } else {
      setEditingStudio({ ...editingStudio, [name]: value });
    }
  };
  const handleSaveStudio = async () => {
    try {
      const timeRangePattern = /^\d{2}:\d{2}(:\d{2})?-\d{2}:\d{2}(:\d{2})?$/;
      if (!timeRangePattern.test(editingStudio.time)) {
        toast.error('Время должно быть в формате HH:MM-HH:MM или HH:MM:SS-HH:MM:SS');
        return;
      }
      const payload = {
        studio_name: editingStudio.studio_name,
        status: editingStudio.status || 'В обработке',
        date: editingStudio.date,
        time: editingStudio.time,
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
      toast.error('Ошибка при сохранении');
    }
  };

  const openDeleteModal = (id) => setDeleteModal({ open: true, id });
  const closeDeleteModal = () => setDeleteModal({ open: false, id: null });

  const confirmDelete = async () => {
    if (!deleteModal.id) return closeDeleteModal();
    try {
      await axios.delete(`http://localhost:3001/api/bookings/studios/${deleteModal.id}`, { withCredentials: true });
      setStudioBookings(studioBookings.filter(b => b.booking_studio_id !== deleteModal.id));
      toast.success('Заявка на фотостудию успешно удалена!');
    } catch (error) {
      toast.error('Ошибка при удалении');
    } finally {
      closeDeleteModal();
    }
  };

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

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="requests-container">
      <ToastContainer position="top-center" autoClose={3000} />
      {/* Модальное окно подтверждения удаления */}
      <Modal
        isOpen={deleteModal.open}
        onRequestClose={closeDeleteModal}
        className="modal"
        overlayClassName="overlay"
        ariaHideApp={false}
      >
        <h2>Подтвердите удаление</h2>
        <p>Вы уверены, что хотите удалить эту заявку?</p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 24 }}>
          <button className="submit-button" style={{ minWidth: 120 }} onClick={confirmDelete}>Удалить</button>
          <button className="submit-button" style={{ minWidth: 120, background: '#ccc', color: '#222' }} onClick={closeDeleteModal}>Отмена</button>
        </div>
      </Modal>
      <h2 className="requests-title" style={{ fontSize: 'clamp(18px, 4vw, 28px)' }}>Заказы на фотостудии</h2>
      <button className="back-button" style={{ margin: '16px 0 24px 0' }} onClick={() => navigate(-1)}>
        Вернуться назад
      </button>

      {/* Форма "Добавить заявку на фотостудию" */}
      <div className="requests-add-card">
        <h3 style={{ fontSize: 'clamp(16px, 3vw, 22px)' }}>Добавить заявку на фотостудию</h3>
        <form onSubmit={handleAddStudio} className="add-form">
          {/* Пользователь (обязательный select) */}
          <select
            name="user_id"
            value={newStudio.user_id}
            onChange={handleNewStudioChange}
            required
            style={{ minWidth: 220, maxWidth: 220 }}
          >
            <option value="" disabled>Пользователь</option>
            {users.map(u => (
              <option key={u.userId} value={u.userId}>{u.name} ({u.email})</option>
            ))}
          </select>
          {/* Выпадающий список для названия студии */}
          <select
            name="studio_name"
            value={newStudio.studio_name}
            onChange={handleNewStudioChange}
            required
            style={{ minWidth: 220, maxWidth: 220 }}
          >
            <option value="" disabled>Название студии</option>
            {studiosList.map(studio => (
              <option key={studio.studio} value={studio.studio}>{studio.studio}</option>
            ))}
          </select>
          {/* Дата */}
          <input
            name="date"
            value={newStudio.date}
            onChange={e => {
              let v = e.target.value;
              if (/^\d{5,}-\d{2}-\d{2}$/.test(v)) {
                v = v.replace(/^(\d{4})\d+(-\d{2}-\d{2})$/, '$1$2');
              }
              setNewStudio({ ...newStudio, date: v });
              if (v.length === 10 && !validateDate(v)) {
                setDateError('Некорректная дата');
              } else if (v && v < todayStr) {
                setDateError('Дата не может быть раньше сегодняшней');
              } else {
                setDateError('');
              }
            }}
            placeholder="Дата (YYYY-MM-DD)"
            required
            type="date"
            inputMode="numeric"
            maxLength={10}
            min={todayStr}
          />
          {dateError && (
            <div style={{
              color: '#b94a48',
              background: '#f2dede',
              border: '1px solid #ebccd1',
              borderRadius: 4,
              padding: '6px 10px',
              margin: '0 0 8px 0',
              fontWeight: 500,
              fontSize: 15,
              width: '100%',
              textAlign: 'left'
            }}>
              {dateError}
            </div>
          )}
          {/* Время начала */}
          <select
            name="time"
            value={newStudio.time}
            onChange={handleNewStudioChange}
            required
            style={{ minWidth: 120, maxWidth: 120 }}
          >
            <option value="" disabled>Время начала</option>
            {generateTimeOptions(MIN_HOUR, MAX_HOUR - 1, false)}
          </select>
          {/* Время конца */}
          <select
            name="end_time"
            value={newStudio.end_time}
            onChange={handleNewStudioChange}
            required
            style={{ minWidth: 120, maxWidth: 120 }}
          >
            <option value="" disabled>Время конца</option>
            {generateTimeOptions(MIN_HOUR + 1, MAX_HOUR, true)}
          </select>
          {/* Адрес (автозаполняется) */}
          <input
            name="address"
            value={newStudio.address}
            readOnly
            placeholder="Адрес"
            required
            type="text"
          />
          {/* Итоговая цена (автоматически считается) */}
          <input
            name="final_price"
            value={newStudio.final_price}
            readOnly
            placeholder="Итоговая цена"
            type="number"
            style={{ background: "#f9f9f9", fontWeight: "bold" }}
            tabIndex={-1}
          />
          {/* Показать предупреждение если выбранный интервал занят */}
          {isStudioIntervalBusy() && (
            <div style={{
              color: '#b94a48',
              background: '#f2dede',
              border: '1px solid #ebccd1',
              borderRadius: 4,
              padding: '6px 10px',
              margin: '0 0 8px 0',
              fontWeight: 500,
              fontSize: 15,
              width: '100%',
              textAlign: 'left'
            }}>
              Выбранное время уже занято!
            </div>
          )}
          <button type="submit">Добавить</button>
        </form>
      </div>

      {/* Таблица "Заказы на фотостудии" с фоновой карточкой */}
      <div className="requests-orders-card">
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
                <th>Время</th>
                <th>Адрес</th>
                <th>Итоговая цена</th>
                <th>Дата создания</th>
                <th>Дата обновления</th>
              </tr>
            </thead>
            <tbody>
              {studioBookings.map((booking) =>
                editingStudio && editingStudio.booking_studio_id === booking.booking_studio_id ? (
                  <tr key={booking.booking_studio_id}>
                    <td>{booking.booking_studio_id}</td>
                    <td>{booking.user}</td>
                    <td>
                      <select
                        name="studio_name"
                        value={editingStudio.studio_name}
                        onChange={handleStudioChange}
                        style={{ minWidth: 260, maxWidth: 350 }}
                      >
                        <option value="" disabled>Название студии</option>
                        {studiosList.map(studio => (
                          <option key={studio.studio} value={studio.studio}>{studio.studio}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        name="status"
                        value={editingStudio.status || ''}
                        onChange={handleStudioChange}
                        style={{ minWidth: 180, maxWidth: 250 }}
                      >
                        <option value="">Выберите статус</option>
                        {STUDIO_STATUSES.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        name="date"
                        value={editingStudio.date}
                        onChange={handleStudioChange}
                        style={{ minWidth: 110, maxWidth: 160 }}
                      />
                    </td>
                    <td>
                      <input
                        name="time"
                        value={editingStudio.time}
                        onChange={handleStudioChange}
                        placeholder="01:00-02:00"
                        style={{ minWidth: 110, maxWidth: 160 }}
                      />
                    </td>
                    <td>
                      <input
                        name="address"
                        value={editingStudio.address}
                        onChange={handleStudioChange}
                        style={{ minWidth: 180, maxWidth: 300 }}
                      />
                    </td>
                    <td>
                      <input
                        name="final_price"
                        value={editingStudio.final_price}
                        readOnly
                        style={{ background: "#f9f9f9", fontWeight: "bold", minWidth: 110, maxWidth: 160 }}
                      />
                    </td>
                    <td>{new Date(booking.created_at).toLocaleDateString()}</td>
                    <td>{new Date(booking.updated_at).toLocaleDateString()}</td>
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
                    <td>{booking.address}</td>
                    <td>{booking.final_price}</td>
                    <td>{new Date(booking.created_at).toLocaleDateString()}</td>
                    <td>{new Date(booking.updated_at).toLocaleDateString()}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
        {selectedStudioId && !editingStudio && (
          <div className="action-buttons">
            <button
              className="edit-user-groups-button edit"
              style={{ background: '#e0e0e0', color: '#222' }}
              onClick={() => handleEditStudio(studioBookings.find(b => b.booking_studio_id === selectedStudioId))}
            >
              Редактировать
            </button>
            <button
              className="edit-user-groups-button delete"
              style={{ background: '#e74c3c', color: '#fff' }}
              onClick={() => openDeleteModal(selectedStudioId)}
            >
              Удалить
            </button>
          </div>
        )}
        {editingStudio && (
          <div className="action-buttons">
            <button
              className="edit-user-groups-button save"
              style={{ background: '#F0BB29', color: '#fff' }}
              onClick={handleSaveStudio}
            >
              Сохранить
            </button>
            <button
              className="edit-user-groups-button"
              style={{ background: '#e0e0e0', color: '#222' }}
              onClick={() => setEditingStudio(null)}
            >
              Отмена
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoStudioRequests;
