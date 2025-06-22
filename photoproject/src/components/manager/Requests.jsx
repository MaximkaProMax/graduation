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

const STUDIO_NAME_OPTIONS = [
  "Зал Hot Yellow с песком и циклорамой",
  "Зал Cozy в фотостудии Replace",
  "Зал APART в фотостудии PHOTO ZALL",
  "Зал White Garden в фотостудии UNICORN STUDIOS"
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
    user_id: '', studio_name: '', date: '', time: '', end_time: '', address: '', final_price: ''
  });
  const [newTypography, setNewTypography] = useState({
    user_id: '', format: '', the_basis_of_the_spread: '', number_of_spreads: '', lamination: '', number_of_copies: '', address_delivery: '', final_price: '', album_name: ''
  });
  const [selectedStudioId, setSelectedStudioId] = useState(null);
  const [selectedTypographyId, setSelectedTypographyId] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, type: null });
  const [users, setUsers] = useState([]);
  const [studiosList, setStudiosList] = useState([]);
  const [studioBookedIntervals, setStudioBookedIntervals] = useState([]);
  const [dateError, setDateError] = useState('');
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

  // Получение списка пользователей
  useEffect(() => {
    axios.get('http://localhost:3001/api/users', { withCredentials: true })
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]));
  }, []);

  // Получение списка фотостудий с адресом и ценой
  useEffect(() => {
    axios.get('http://localhost:3001/api/photostudios')
      .then(res => setStudiosList(res.data))
      .catch(() => setStudiosList([]));
  }, []);

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
      // Разрешаем диапазон времени вида HH:MM-HH:MM или HH:MM:SS-HH:MM:SS
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
      toast.error('Ошибка при сохранении');
    }
  };

  const handleEditTypography = (booking) => setEditingTypography({ ...booking });
  const handleTypographyChange = (e) => {
    setEditingTypography({ ...editingTypography, [e.target.name]: e.target.value });
  };
  const handleSaveTypography = async () => {
    try {
      // Проверяем наличие id перед отправкой запроса
      if (
        !editingTypography ||
        !editingTypography.booking_typographie_id ||
        isNaN(Number(editingTypography.booking_typographie_id))
      ) {
        toast.error('Ошибка: не найден корректный идентификатор заявки на типографию.');
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
        toast.error('Ошибка: заявка на типографию не найдена на сервере (404).');
      } else {
        toast.error('Ошибка при сохранении');
      }
    }
  };

  const handleNewStudioChange = (e) => {
    const { name, value } = e.target;
    if (name === "date") {
      if (value.length === 10 && !validateDate(value)) {
        setDateError('Некорректная дата');
      } else {
        setDateError('');
      }
    }
    setNewStudio({ ...newStudio, [name]: value });
  };
  const handleAddStudio = async (e) => {
    e.preventDefault();
    // Проверка типов
    if (!newStudio.studio_name.trim()) return toast.error('Название студии обязательно');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(newStudio.date)) return toast.error('Дата должна быть в формате YYYY-MM-DD');
    if (!/^\d{2}:\d{2}$/.test(newStudio.time)) return toast.error('Время начала должно быть в формате HH:MM');
    if (!/^\d{2}:\d{2}$/.test(newStudio.end_time)) return toast.error('Время конца должно быть в формате HH:MM');
    if (!newStudio.address.trim()) return toast.error('Адрес обязателен');
    if (isNaN(Number(newStudio.final_price))) return toast.error('Цена должна быть числом');
    if (!newStudio.user_id) return toast.error('Выберите пользователя');
    if (!newStudio.studio_name) return toast.error('Выберите студию');
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
      console.log('Отправка данных бронирования фотостудии:', payload);
      await axios.post('http://localhost:3001/api/bookings/studios/add', payload, { withCredentials: true });
      toast.success('Заявка на фотостудию успешно создана!');
      setNewStudio({ user_id: '', studio_name: '', date: '', time: '', end_time: '', address: '', final_price: '' });
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
    if (!newTypography.format) return toast.error('Выберите формат');
    if (!newTypography.the_basis_of_the_spread) return toast.error('Выберите основу разворота');
    if (!newTypography.lamination) return toast.error('Выберите ламинацию');
    if (!newTypography.album_name) return toast.error('Выберите название альбома');
    // Проверка типов
    if (!newTypography.format.trim()) return toast.error('Формат обязателен');
    if (newTypography.the_basis_of_the_spread && typeof newTypography.the_basis_of_the_spread !== 'string') return toast.error('Основа разворота должна быть строкой');
    if (!/^\d+$/.test(newTypography.number_of_spreads)) return toast.error('Кол-во разворотов должно быть целым числом');
    if (!newTypography.lamination.trim()) return toast.error('Ламинация обязательна');
    if (!/^\d+$/.test(newTypography.number_of_copies)) return toast.error('Кол-во копий должно быть целым числом');
    if (newTypography.address_delivery && typeof newTypography.address_delivery !== 'string') return toast.error('Адрес доставки должен быть строкой');
    if (isNaN(Number(newTypography.final_price))) return toast.error('Цена должна быть числом');
    if (!newTypography.album_name.trim()) return toast.error('Название альбома обязательно');
    if (!newTypography.user_id) return toast.error('Выберите пользователя');
    try {
      const payload = {
        user_id: newTypography.user_id,
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
      setNewTypography({ user_id: '', format: '', the_basis_of_the_spread: '', number_of_spreads: '', lamination: '', number_of_copies: '', address_delivery: '', final_price: '', album_name: '' });
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

  // Пересчет итоговой суммы при редактировании типографии
  useEffect(() => {
    if (!editingTypography) return;
    const spreads = Math.max(Number(editingTypography.number_of_spreads) || 0, MIN_SPREADS);
    const copies = Number(editingTypography.number_of_copies) || 0;
    if (spreads && copies) {
      const total = (spreads * SPREAD_PRICE) + (copies * ALBUM_PRICE);
      setEditingTypography(et => ({ ...et, final_price: total }));
    }
  // eslint-disable-next-line
  }, [editingTypography?.number_of_spreads, editingTypography?.number_of_copies]);

  // Пересчет итоговой суммы при редактировании фотостудии
  useEffect(() => {
    if (!editingStudio) return;
    // Найти цену за час для выбранной студии
    let pricePerHour = 0;
    if (editingStudio.studio_name && studiosList.length) {
      const studioObj = studiosList.find(s => s.studio === editingStudio.studio_name);
      if (studioObj && studioObj.price) {
        pricePerHour = parseFloat(String(studioObj.price).replace(/[^\d.-]/g, '')) || 0;
      }
    }
    // Время в формате "09:00-11:00" или "09:00:00-11:00:00"
    let hours = 0;
    if (editingStudio.time) {
      const [start, end] = editingStudio.time.split('-');
      if (start && end) {
        const [startHour] = start.split(':').map(Number);
        const [endHour] = end.split(':').map(Number);
        hours = endHour - startHour;
      }
    }
    const total = hours > 0 ? hours * pricePerHour : 0;
    setEditingStudio(es => ({ ...es, final_price: total }));
  // eslint-disable-next-line
  }, [editingStudio?.time, editingStudio?.studio_name, studiosList]);

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
    // Проверяем формат YYYY-MM-DD и что год из 4 цифр
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
    const [year, month, day] = dateStr.split('-').map(Number);
    if (year < 1900 || year > 2100) return false;
    // Проверяем существование даты
    const d = new Date(dateStr);
    return d && d.getFullYear() === year && d.getMonth() + 1 === month && d.getDate() === day;
  };

  // Получаем сегодняшнюю дату в формате YYYY-MM-DD (добавить в начало компонента)
  const todayStr = React.useMemo(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }, []);

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
          {/* Пользователь (обязательный select) */}
          <select
            name="user_id"
            value={newTypography.user_id}
            onChange={handleNewTypographyChange}
            required
            style={{ minWidth: 220, maxWidth: 220 }}
          >
            <option value="" disabled>Пользователь</option>
            {users.map(u => (
              <option key={u.userId} value={u.userId}>{u.name} ({u.email})</option>
            ))}
          </select>
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
            placeholder="Итоговая цена"
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
              // Ограничиваем год 4 символами при ручном вводе
              let v = e.target.value;
              if (/^\d{5,}-\d{2}-\d{2}$/.test(v)) {
                v = v.replace(/^(\d{4})\d+(-\d{2}-\d{2})$/, '$1$2');
              }
              setNewStudio({ ...newStudio, date: v });
              // Валидация даты
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
            {generateTimeOptions(9, 20, false)}
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
            {generateTimeOptions(10, 21, true)}
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
                    <td>
                      <select
                        name="format"
                        value={editingTypography.format}
                        onChange={handleTypographyChange}
                        style={{ minWidth: 100 }}
                      >
                        <option value="" disabled>Формат</option>
                        {FORMAT_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        name="the_basis_of_the_spread"
                        value={editingTypography.the_basis_of_the_spread}
                        onChange={handleTypographyChange}
                        style={{ minWidth: 120 }}
                      >
                        <option value="" disabled>Основа разворота</option>
                        {BASIS_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input name="number_of_spreads" value={editingTypography.number_of_spreads} onChange={handleTypographyChange} />
                    </td>
                    <td>
                      <select
                        name="lamination"
                        value={editingTypography.lamination}
                        onChange={handleTypographyChange}
                        style={{ minWidth: 100 }}
                      >
                        <option value="" disabled>Ламинация</option>
                        {LAMINATION_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input name="number_of_copies" value={editingTypography.number_of_copies} onChange={handleTypographyChange} />
                    </td>
                    <td>
                      <input name="address_delivery" value={editingTypography.address_delivery} onChange={handleTypographyChange} />
                    </td>
                    <td>
                      <input
                        name="final_price"
                        value={editingTypography.final_price}
                        readOnly
                        style={{ background: "#f9f9f9", fontWeight: "bold" }}
                      />
                    </td>
                    <td>
                      <select
                        name="album_name"
                        value={editingTypography.album_name}
                        onChange={handleTypographyChange}
                        style={{ minWidth: 120 }}
                      >
                        <option value="" disabled>Название альбома</option>
                        {ALBUM_NAME_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </td>
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
        </div>
        {/* Кнопки действий вынесены из table-container */}
        {selectedTypographyId && !editingTypography && (
          <div className="action-buttons" style={{ marginTop: 0 }}>
            <button
              className="edit-user-groups-button edit"
              style={{ background: '#e0e0e0', color: '#222' }}
              onClick={() => handleEditTypography(typographyBookings.find(b => b.booking_typographie_id === selectedTypographyId))}
            >
              Редактировать
            </button>
            <button
              className="edit-user-groups-button delete"
              style={{ background: '#e74c3c', color: '#fff' }}
              onClick={() => handleDeleteTypography(selectedTypographyId)}
            >
              Удалить
            </button>
          </div>
        )}
        {editingTypography && (
          <div className="action-buttons" style={{ marginTop: 0 }}>
            <button
              className="edit-user-groups-button save"
              style={{ background: '#F0BB29', color: '#fff' }}
              onClick={handleSaveTypography}
            >
              Сохранить
            </button>
            <button
              className="edit-user-groups-button"
              style={{ background: '#e0e0e0', color: '#222' }}
              onClick={() => setEditingTypography(null)}
            >
              Отмена
            </button>
          </div>
        )}
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
        {/* Кнопки действий вынесены из table-container */}
        {selectedStudioId && !editingStudio && (
          <div className="action-buttons" style={{ marginTop: 0 }}>
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
              onClick={() => handleDeleteStudio(selectedStudioId)}
            >
              Удалить
            </button>
          </div>
        )}
        {editingStudio && (
          <div className="action-buttons" style={{ marginTop: 0 }}>
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

export default Requests;