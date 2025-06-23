import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Requests.css';
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

const PrintingHouseRequests = () => {
  const [typographyBookings, setTypographyBookings] = useState([]);
  const [editingTypography, setEditingTypography] = useState(null);
  const [newTypography, setNewTypography] = useState({
    user_id: '', format: '', the_basis_of_the_spread: '', number_of_spreads: '', lamination: '', number_of_copies: '', address_delivery: '', final_price: '', album_name: ''
  });
  const [selectedTypographyId, setSelectedTypographyId] = useState(null);
  const [users, setUsers] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/api/users/check-role', { withCredentials: true })
      .then(response => {
        if (response.data.success && (response.data.role === 'Admin' || response.data.role === 'Manager')) {
          setIsAuthorized(true);
          fetchTypographyRequests();
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

  // Модальное окно для подтверждения удаления
  const openDeleteModal = (id) => setDeleteModal({ open: true, id });
  const closeDeleteModal = () => setDeleteModal({ open: false, id: null });

  const confirmDelete = async () => {
    if (!deleteModal.id) return closeDeleteModal();
    try {
      await axios.delete(`http://localhost:3001/api/bookings/typography/${deleteModal.id}`, { withCredentials: true });
      setTypographyBookings(typographyBookings.filter(b => b.booking_typographie_id !== deleteModal.id));
      toast.success('Заявка на типографию успешно удалена!');
    } catch (error) {
      toast.error('Ошибка при удалении');
    } finally {
      closeDeleteModal();
    }
  };

  const handleDeleteTypography = (id) => openDeleteModal(id);

  const handleEditTypography = (booking) => setEditingTypography({ ...booking });
  const handleTypographyChange = (e) => {
    setEditingTypography({ ...editingTypography, [e.target.name]: e.target.value });
  };
  const handleSaveTypography = async () => {
    try {
      if (
        !editingTypography ||
        !editingTypography.booking_typographie_id ||
        isNaN(Number(editingTypography.booking_typographie_id))
      ) {
        toast.error('Ошибка: не найден корректный идентификатор заявки на типографию.');
        return;
      }
      await axios.put(
        `http://localhost:3001/api/bookings/typography/${editingTypography.booking_typographie_id}`,
        editingTypography,
        { withCredentials: true }
      );
      setEditingTypography(null);
      fetchTypographyRequests();
    } catch (err) {
      toast.error('Ошибка при сохранении');
    }
  };

  const handleNewTypographyChange = (e) => {
    const { name, value } = e.target;
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
    if (!newTypography.format) return toast.error('Выберите формат');
    if (!newTypography.the_basis_of_the_spread) return toast.error('Выберите основу разворота');
    if (!newTypography.lamination) return toast.error('Выберите ламинацию');
    if (!newTypography.album_name) return toast.error('Выберите название альбома');
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
      await axios.post('http://localhost:3001/api/bookings/add', payload, { withCredentials: true });
      toast.success('Заявка на типографию успешно создана!');
      setNewTypography({ user_id: '', format: '', the_basis_of_the_spread: '', number_of_spreads: '', lamination: '', number_of_copies: '', address_delivery: '', final_price: '', album_name: '' });
      fetchTypographyRequests();
    } catch (err) {
      toast.error('Ошибка при добавлении');
    }
  };

  // Автоматический расчет итоговой суммы для заявки на типографию
  useEffect(() => {
    const spreads = Math.max(Number(newTypography.number_of_spreads) || 0, MIN_SPREADS);
    const copies = Number(newTypography.number_of_copies) || 0;
    if (spreads && copies) {
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
      <button className="back-button" style={{ margin: '16px 0 24px 0' }} onClick={() => navigate(-1)}>
        Вернуться назад
      </button>

      {/* Карточка для формы */}
      <div className="requests-add-card">
        <h3 style={{ fontSize: 'clamp(16px, 3vw, 22px)' }}>Добавить заявку на типографию</h3>
        <form onSubmit={handleAddTypography} className="add-form">
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
          <input
            name="final_price"
            value={newTypography.final_price}
            readOnly
            placeholder="Итоговая цена"
            type="number"
            style={{ background: "#f9f9f9", fontWeight: "bold" }}
            tabIndex={-1}
          />
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
      </div>

      {/* Карточка для таблицы */}
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
        {selectedTypographyId && !editingTypography && (
          <div className="action-buttons">
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
          <div className="action-buttons">
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
      </div>
    </div>
  );
};

export default PrintingHouseRequests;
