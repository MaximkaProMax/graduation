import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Requests.css';
import { useNavigate } from 'react-router-dom';
import { checkPageAccess } from '../../utils/checkPageAccess';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';

const PhoneRequests = () => {
  const [phoneBookings, setPhoneBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [newBooking, setNewBooking] = useState({
    full_name: '', telephone: '', photostudio: '', printing: '', comment: '', status: ''
  });
  const [photostudios, setPhotostudios] = useState([]);
  const [printings, setPrintings] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const navigate = useNavigate();

  const statusOptions = [
    'Новая заявка',
    'В обработке',
    'Ожидает подтверждения',
    'Подтверждена',
    'Ожидает оплаты',
    'Оплачена',
    'Передана в исполнение',
    'Завершено',
    'Отменено',
    'Перенесено',
  ];

  useEffect(() => {
    checkPageAccess('PhoneRequests', navigate, setIsAuthorized, setIsLoading);
  }, [navigate]);

  useEffect(() => {
    if (isAuthorized) {
      fetchPhoneRequests();
      fetchPhotostudiosAndPrintings();
    }
  }, [isAuthorized]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.requests-table') && !e.target.closest('.action-buttons')) {
        setSelectedBookingId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const fetchPhoneRequests = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/booking-by-phone', { withCredentials: true });
      setPhoneBookings(response.data.bookings);
    } catch (error) {
      console.error('Ошибка при загрузке заявок:', error);
    }
  };

  const fetchPhotostudiosAndPrintings = async () => {
    try {
      const photostudiosResponse = await axios.get('http://localhost:3001/api/photostudios');
      setPhotostudios(photostudiosResponse.data);

      const printingsResponse = await axios.get('http://localhost:3001/api/printing');
      setPrintings(printingsResponse.data);
    } catch (error) {
      console.error('Ошибка при загрузке данных фотостудий и типографий:', error);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Удалить заявку?')) return;
    try {
      await axios.delete(`http://localhost:3001/api/booking-by-phone/phone/${id}`, { withCredentials: true });
      setPhoneBookings(phoneBookings.filter(b => b.booking_by_phone_id !== id));
    } catch (error) {
      alert('Ошибка при удалении');
    }
  };

  const handleEditBooking = (booking) => setEditingBooking({ ...booking });
  const handleBookingChange = (e) => setEditingBooking({ ...editingBooking, [e.target.name]: e.target.value });
  const handleSaveBooking = async () => {
    if (!editingBooking || !editingBooking.booking_by_phone_id) {
      alert('Некорректные данные для сохранения');
      return;
    }

    try {
      await axios.put(
        `http://localhost:3001/api/booking-by-phone/${editingBooking.booking_by_phone_id}`,
        editingBooking,
        { withCredentials: true }
      );
      setEditingBooking(null);
      fetchPhoneRequests();
    } catch (err) {
      console.error('Ошибка при сохранении:', err);
      alert('Ошибка при сохранении');
    }
  };

  const handleNewBookingChange = (e) => setNewBooking({ ...newBooking, [e.target.name]: e.target.value });
  const handleAddBooking = async (e) => {
    e.preventDefault();
    if (!newBooking.full_name.trim()) return toast.error('Имя клиента обязательно');
    if (!/^\d{10,15}$/.test(newBooking.telephone)) return toast.error('Телефон должен содержать от 10 до 15 цифр');
    if (!newBooking.photostudio.trim()) return toast.error('Фотостудия обязательна');
    if (!newBooking.printing.trim()) return toast.error('Типография обязательна');
    try {
      await axios.post('http://localhost:3001/api/booking-by-phone/phone/add', newBooking, { withCredentials: true });
      toast.success('Заявка успешно создана!');
      setNewBooking({ full_name: '', telephone: '', photostudio: '', printing: '', comment: '', status: '' });
      fetchPhoneRequests();
    } catch (err) {
      toast.error('Ошибка при добавлении');
    }
  };

  // Модальное окно для подтверждения удаления
  const openDeleteModal = (id) => setDeleteModal({ open: true, id });
  const closeDeleteModal = () => setDeleteModal({ open: false, id: null });

  const confirmDelete = async () => {
    if (!deleteModal.id) return closeDeleteModal();
    try {
      await axios.delete(`http://localhost:3001/api/booking-by-phone/phone/${deleteModal.id}`, { withCredentials: true });
      setPhoneBookings(phoneBookings.filter(b => b.booking_by_phone_id !== deleteModal.id));
      toast.success('Заявка успешно удалена!');
    } catch (error) {
      toast.error('Ошибка при удалении');
    } finally {
      closeDeleteModal();
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

      <h2 className="requests-title">Заявки по телефону</h2>
      <button className="back-button" onClick={() => navigate(-1)}>Вернуться назад</button>

      {/* Карточка для формы */}
      <div className="requests-add-card">
        <h3>Добавить заявку</h3>
        <form onSubmit={handleAddBooking} className="add-form">
          <input name="full_name" value={newBooking.full_name} onChange={handleNewBookingChange} placeholder="Имя клиента" required />
          <input
            name="telephone"
            value={newBooking.telephone}
            onChange={e => {
              // Оставляем только цифры
              const value = e.target.value.replace(/\D/g, '');
              setNewBooking({ ...newBooking, telephone: value });
            }}
            placeholder="Телефон"
            required
            type="tel"
            inputMode="numeric"
            pattern="\d*"
            maxLength={15}
          />
          <select
            name="photostudio"
            value={newBooking.photostudio}
            onChange={handleNewBookingChange}
            required
          >
            <option value="">Выберите фотостудию</option>
            {photostudios.map((studio) => (
              <option key={studio.id} value={studio.studio}>
                {studio.studio}
              </option>
            ))}
          </select>
          <select
            name="printing"
            value={newBooking.printing}
            onChange={handleNewBookingChange}
            required
          >
            <option value="">Выберите типографию</option>
            {printings.map((printing) => (
              <option key={printing.id} value={printing.main_album_name}>
                {printing.main_album_name}
              </option>
            ))}
          </select>
          <textarea
            name="comment"
            value={newBooking.comment}
            onChange={handleNewBookingChange}
            placeholder="Комментарий"
            className="modal-input modal-textarea"
          />
          <select
            name="status"
            value={newBooking.status}
            onChange={handleNewBookingChange}
            required
          >
            <option value="">Выберите статус</option>
            {statusOptions.map((status, index) => (
              <option key={index} value={status}>
                {status}
              </option>
            ))}
          </select>
          <button type="submit">Добавить</button>
        </form>
      </div>

      {/* Карточка для таблицы */}
      <div className="requests-orders-card">
        <h3>Список заявок</h3>
        <div className="table-container">
          <table className="requests-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Имя клиента</th>
                <th>Телефон</th>
                <th>Фотостудия</th>
                <th>Типография</th>
                <th>Комментарий</th>
                <th>Статус</th>
                <th>Дата создания</th>
                <th>Дата обновления</th>
              </tr>
            </thead>
            <tbody>
              {phoneBookings.map((booking) =>
                editingBooking && editingBooking.booking_by_phone_id === booking.booking_by_phone_id ? (
                  <tr key={booking.booking_by_phone_id}>
                    <td>{booking.booking_by_phone_id}</td>
                    <td><input name="full_name" value={editingBooking.full_name} onChange={handleBookingChange} /></td>
                    <td>
                      <input
                        name="telephone"
                        value={editingBooking.telephone}
                        onChange={e => {
                          // Оставляем только цифры
                          const value = e.target.value.replace(/\D/g, '');
                          setEditingBooking({ ...editingBooking, telephone: value });
                        }}
                        type="tel"
                        inputMode="numeric"
                        pattern="\d*"
                        maxLength={15}
                      />
                    </td>
                    <td>
                      <select
                        name="photostudio"
                        value={editingBooking.photostudio}
                        onChange={handleBookingChange}
                      >
                        <option value="">Выберите фотостудию</option>
                        {photostudios.map((studio) => (
                          <option key={studio.id} value={studio.studio}>
                            {studio.studio}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        name="printing"
                        value={editingBooking.printing}
                        onChange={handleBookingChange}
                      >
                        <option value="">Выберите типографию</option>
                        {printings.map((printing) => (
                          <option key={printing.id} value={printing.main_album_name}>
                            {printing.main_album_name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <textarea
                        name="comment"
                        value={editingBooking.comment}
                        onChange={handleBookingChange}
                        className="modal-input modal-textarea"
                      />
                    </td>
                    <td>
                      <select
                        name="status"
                        value={editingBooking.status}
                        onChange={handleBookingChange}
                      >
                        <option value="">Выберите статус</option>
                        {statusOptions.map((status, index) => (
                          <option key={index} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{new Date(booking.created_at).toLocaleDateString()}</td>
                    <td>{new Date(booking.updated_at).toLocaleDateString()}</td>
                  </tr>
                ) : (
                  <tr
                    key={booking.booking_by_phone_id}
                    className={selectedBookingId === booking.booking_by_phone_id ? 'selected-row' : ''}
                    onClick={() => setSelectedBookingId(booking.booking_by_phone_id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{booking.booking_by_phone_id}</td>
                    <td>{booking.full_name}</td>
                    <td>{booking.telephone}</td>
                    <td>{booking.photostudio}</td>
                    <td>{booking.printing}</td>
                    <td>{booking.comment}</td>
                    <td>{booking.status}</td>
                    <td>{new Date(booking.created_at).toLocaleDateString()}</td>
                    <td>{new Date(booking.updated_at).toLocaleDateString()}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
        {selectedBookingId && !editingBooking && (
          <div className="action-buttons">
            <button
              className="edit-user-groups-button edit"
              style={{ background: '#e0e0e0', color: '#222' }}
              onClick={() => handleEditBooking(phoneBookings.find(b => b.booking_by_phone_id === selectedBookingId))}
            >
              Редактировать
            </button>
            <button
              className="edit-user-groups-button delete"
              style={{ background: '#e74c3c', color: '#fff' }}
              onClick={() => openDeleteModal(selectedBookingId)}
            >
              Удалить
            </button>
          </div>
        )}
        {editingBooking && (
          <div className="action-buttons">
            <button
              className="edit-user-groups-button save"
              style={{ background: '#F0BB29', color: '#fff' }}
              onClick={handleSaveBooking}
            >
              Сохранить
            </button>
            <button
              className="edit-user-groups-button"
              style={{ background: '#e0e0e0', color: '#222' }}
              onClick={() => setEditingBooking(null)}
            >
              Отмена
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneRequests;
