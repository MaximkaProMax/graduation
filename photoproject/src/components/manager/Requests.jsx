import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/Requests.css";
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';

const TYPOGRAPHY_STATUSES = [
  "Новый заказ",
  "Подтвержден",
  "В работе",
  "Печать завершена",
  "Готов к отправке",
  "Отправлен",
  "Доставлен",
  "Отменен",
  "Ожидание оплаты",
  "Возврат / Рекламация"
];

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

const FORMAT_OPTIONS = [
  "20x30",
  "23x23",
  "30x23",
  "30x30"
];

const BASIS_OPTIONS = [
  "С основой",
  "Без основы"
];

const LAMINATION_OPTIONS = [
  "Матовый",
  "Глянец"
];

const ALBUM_NAME_OPTIONS = [
  "LayFlat",
  "FlexBind"
];

const MIN_SPREADS = 2;
const SPREAD_PRICE = 130;
const ALBUM_PRICE = 600;

const Requests = () => {
  const [typographyBookings, setTypographyBookings] = useState([]);
  const [studioBookings, setStudioBookings] = useState([]);
  const [editingStudio, setEditingStudio] = useState(null);
  const [editingTypography, setEditingTypography] = useState(null);
  const [newStudio, setNewStudio] = useState({
    studio_name: '', date: '', time: '', end_time: '', address: '', final_price: ''
  });
  const [newTypography, setNewTypography] = useState({
    format: '', the_basis_of_the_spread: '', number_of_spreads: '', lamination: '', number_of_copies: '', address_delivery: '', final_price: '', album_name: ''
  });
  const [selectedStudioId, setSelectedStudioId] = useState(null);
  const [selectedTypographyId, setSelectedTypographyId] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, type: null });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/api/users/check-role', { withCredentials: true })
      .then(response => {
        if (response.data.success && (response.data.role === 'Admin' || response.data.role === 'Manager')) {
          setIsAuthorized(true);
          fetchAllRequests();
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

  const fetchAllRequests = async () => {
    try {
      const typographyResponse = await axios.get('http://localhost:3001/api/bookings/typography/all', {
        withCredentials: true,
      });
      setTypographyBookings(typographyResponse.data.bookings);

      const studioResponse = await axios.get('http://localhost:3001/api/bookings/studios/all', {
        withCredentials: true,
      });
      setStudioBookings(studioResponse.data.bookings);
    } catch (error) {
      console.error('Ошибка при загрузке заявок:', error);
    }
  };

  const openDeleteModal = (id, type) => setDeleteModal({ open: true, id, type });
  const closeDeleteModal = () => setDeleteModal({ open: false, id: null, type: null });

  const confirmDelete = async () => {
    if (!deleteModal.id || !deleteModal.type) return closeDeleteModal();
    try {
      if (deleteModal.type === 'studio') {
        await axios.delete(`http://localhost:3001/api/bookings/studios/${deleteModal.id}`, { withCredentials: true });
        setStudioBookings(studioBookings.filter(b => b.booking_studio_id !== deleteModal.id));
        toast.success('Заявка на фотостудию успешно удалена!');
      } else if (deleteModal.type === 'typography') {
        await axios.delete(`http://localhost:3001/api/bookings/typography/${deleteModal.id}`, { withCredentials: true });
        setTypographyBookings(typographyBookings.filter(b => b.booking_typographie_id !== deleteModal.id));
        toast.success('Заявка на типографию успешно удалена!');
      }
    } catch (error) {
      toast.error('Ошибка при удалении');
    } finally {
      closeDeleteModal();
    }
  };

  const handleDeleteStudio = (id) => openDeleteModal(id, 'studio');
  const handleDeleteTypography = (id) => openDeleteModal(id, 'typography');

  const handleEditStudio = (booking) => setEditingStudio({ ...booking });
  const handleStudioChange = (e) => setEditingStudio({ ...editingStudio, [e.target.name]: e.target.value });
  const handleSaveStudio = async () => {
    try {
      // Разрешаем диапазон времени вида HH:MM-HH:MM или HH:MM:SS-HH:MM:SS
      const timeRangePattern = /^\d{2}:\d{2}(:\d{2})?-\d{2}:\d{2}(:\d{2})?$/;
      if (!timeRangePattern.test(editingStudio.time)) {
        alert('Время должно быть в формате HH:MM-HH:MM или HH:MM:SS-HH:MM:SS');
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
      console.log('PUT /studios/:id payload:', payload);
      await axios.put(
        `http://localhost:3001/api/bookings/studios/${editingStudio.booking_studio_id}`,
        payload,
        { withCredentials: true }
      );
      setEditingStudio(null);
      fetchAllRequests();
    } catch (err) {
      console.error('Ошибка при сохранении заявки на фотостудию:', err);
      alert('Ошибка при сохранении');
    }
  };

  const handleEditTypography = (booking) => setEditingTypography({ ...booking });
  const handleTypographyChange = (e) => setEditingTypography({ ...editingTypography, [e.target.name]: e.target.value });
  const handleSaveTypography = async () => {
    try {
      // Проверяем наличие id перед отправкой запроса
      if (
        !editingTypography ||
        !editingTypography.booking_typographie_id ||
        isNaN(Number(editingTypography.booking_typographie_id))
      ) {
        alert('Ошибка: не найден корректный идентификатор заявки на типографию.');
        return;
      }
      // Для отладки: логируем id и данные
      console.log(
        'PUT /api/bookings/typography/' + editingTypography.booking_typographie_id,
        editingTypography
      );
      await axios.put(
        `http://localhost:3001/api/bookings/typography/${editingTypography.booking_typographie_id}`,
        editingTypography,
        { withCredentials: true }
      );
      setEditingTypography(null);
      fetchAllRequests();
    } catch (err) {
      console.error('Ошибка при сохранении заявки на типографию:', err);
      if (err.response && err.response.status === 404) {
        alert('Ошибка: заявка на типографию не найдена на сервере (404).');
      } else {
        alert('Ошибка при сохранении');
      }
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
        time: `${newStudio.time}-${newStudio.end_time}`,
        address: newStudio.address,
        totalCost: newStudio.final_price,
      };
      console.log('Отправка данных бронирования фотостудии:', payload);
      await axios.post('http://localhost:3001/api/bookings/studios/add', payload, { withCredentials: true });
      toast.success('Заявка на фотостудию успешно создана!');
      setNewStudio({ studio_name: '', date: '', time: '', end_time: '', address: '', final_price: '' });
      fetchAllRequests();
    } catch (err) {
      console.error('Ошибка при добавлении заявки на фотостудию:', err);
      toast.error('Ошибка при добавлении');
    }
  };

  const handleNewTypographyChange = (e) => {
    const { name, value } = e.target;
    // Для number_of_spreads — не даём ввести меньше 2
    if (name === "number_of_spreads") {
      let val = Number(value);
      if (val < MIN_SPREADS) val = MIN_SPREADS;
      setNewTypography({ ...newTypography, [name]: val });
    } else {
      setNewTypography({ ...newTypography, [name]: value });
    }
  };
  const handleAddTypography = async (e) => {
    e.preventDefault();
    // Проверка обязательных select-полей
    if (!newTypography.format) return alert('Выберите формат');
    if (!newTypography.the_basis_of_the_spread) return alert('Выберите основу разворота');
    if (!newTypography.lamination) return alert('Выберите ламинацию');
    if (!newTypography.album_name) return alert('Выберите название альбома');
    // Проверка типов
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
      console.log('Отправка данных бронирования типографии:', payload);
      await axios.post('http://localhost:3001/api/bookings/add', payload, { withCredentials: true });
      toast.success('Заявка на типографию успешно создана!');
      setNewTypography({ format: '', the_basis_of_the_spread: '', number_of_spreads: '', lamination: '', number_of_copies: '', address_delivery: '', final_price: '', album_name: '' });
      fetchAllRequests();
    } catch (err) {
      console.error('Ошибка при добавлении заявки на типографию:', err);
      toast.error('Ошибка при добавлении');
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.requests-table') && !e.target.closest('.action-buttons')) {
        setSelectedStudioId(null);
        setSelectedTypographyId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Автоматический расчет итоговой суммы для заявки на типографию
  useEffect(() => {
    const spreads = Math.max(Number(newTypography.number_of_spreads) || 0, MIN_SPREADS);
    const copies = Number(newTypography.number_of_copies) || 0;
    if (spreads && copies) {
      // Новая формула: (развороты * 130) + (копий * 600)
      const total = (spreads * SPREAD_PRICE) + (copies * ALBUM_PRICE);
      setNewTypography(nt => ({ ...nt, final_price: total }));
    } else {
      setNewTypography(nt => ({ ...nt, final_price: '' }));
    }
  // eslint-disable-next-line
  }, [newTypography.number_of_spreads, newTypography.number_of_copies]);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!isAuthorized) {
    return null; // Не отображаем ничего, если пользователь не авторизован
  }

  return (
    <div className="requests-container">
      <ToastContainer position="top-center" autoClose={3000} />
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

      <button className="back-button" style={{ margin: '16px 0 24px 0' }} onClick={() => navigate(-1)}>
        Вернуться назад
      </button>

      <div className="requests-add-card">
        <h3 style={{ fontSize: 'clamp(16px, 3vw, 22px)' }}>Добавить заявку на типографию</h3>
        <form onSubmit={handleAddTypography} className="add-form">
          {/* Формат (обязательный select) */}
          <select
            name="format"
            value={newTypography.format}
            onChange={handleNewTypographyChange}
            required
            style={{ minWidth: 220, maxWidth: 220 }}
          >
            <option value="" disabled>Формат</option>
            {FORMAT_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {/* Основа разворота (обязательный select) */}
          <select
            name="the_basis_of_the_spread"
            value={newTypography.the_basis_of_the_spread}
            onChange={handleNewTypographyChange}
            required
            style={{ minWidth: 220, maxWidth: 220 }}
          >
            <option value="" disabled>Основа разворота</option>
            {BASIS_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {/* Ламинация (обязательный select) */}
          <select
            name="lamination"
            value={newTypography.lamination}
            onChange={handleNewTypographyChange}
            required
            style={{ minWidth: 220, maxWidth: 220 }}
          >
            <option value="" disabled>Ламинация</option>
            {LAMINATION_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <input
            name="number_of_spreads"
            value={newTypography.number_of_spreads}
            onChange={handleNewTypographyChange}
            placeholder="Кол-во разворотов"
            required
            type="number"
            min={MIN_SPREADS}
            step="1"
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
          {/* Итоговая сумма (только для чтения) */}
          <input
            name="final_price"
            value={newTypography.final_price}
            readOnly
            placeholder="Цена"
            type="number"
            style={{ background: "#f9f9f9", fontWeight: "bold" }}
            tabIndex={-1}
          />
          {/* Название альбома (обязательный select) */}
          <select
            name="album_name"
            value={newTypography.album_name}
            onChange={handleNewTypographyChange}
            required
            style={{ minWidth: 220, maxWidth: 220 }}
          >
            <option value="" disabled>Название альбома</option>
            {ALBUM_NAME_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <button type="submit">Добавить</button>
        </form>

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
      </div>

      <div className="requests-orders-card">
        <h3 style={{ fontSize: 'clamp(16px, 3vw, 22px)' }}>Заказы на типографию</h3>
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
              </tr>
            </thead>
            <tbody>
              {typographyBookings.map((booking) =>
                editingTypography && editingTypography.booking_typographie_id === booking.booking_typographie_id ? (
                  <tr key={booking.booking_typographie_id}>
                    <td>{booking.booking_typographie_id}</td>
                    <td>{booking.user}</td>
                    <td>
                      <select
                        name="status"
                        value={editingTypography.status || ''}
                        onChange={handleTypographyChange}
                        style={{ minWidth: 120 }}
                      >
                        <option value="">Выберите статус</option>
                        {TYPOGRAPHY_STATUSES.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
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
                  </tr>
                )
              )}
            </tbody>
          </table>
          {/* Кнопки действий оставляем вне таблицы */}
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
                    <td><input name="studio_name" value={editingStudio.studio_name} onChange={handleStudioChange} /></td>
                    <td>
                      <select
                        name="status"
                        value={editingStudio.status || ''}
                        onChange={handleStudioChange}
                        style={{ minWidth: 120 }}
                      >
                        <option value="">Выберите статус</option>
                        {STUDIO_STATUSES.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td><input name="date" value={editingStudio.date} onChange={handleStudioChange} /></td>
                    <td><input name="time" value={editingStudio.time} onChange={handleStudioChange} placeholder="01:00-02:00" /></td>
                    <td><input name="address" value={editingStudio.address} onChange={handleStudioChange} /></td>
                    <td><input name="final_price" value={editingStudio.final_price} onChange={handleStudioChange} /></td>
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
          {/* Кнопки действий оставляем вне таблицы */}
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
    </div>
  );
};

export default Requests;