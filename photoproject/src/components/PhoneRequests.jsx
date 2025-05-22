import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Requests.css';
import { useNavigate } from 'react-router-dom';
import { checkPageAccess } from '../utils/checkPageAccess';

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
    if (!newBooking.full_name.trim()) return alert('Имя клиента обязательно');
    if (!/^\d{10,15}$/.test(newBooking.telephone)) return alert('Телефон должен содержать от 10 до 15 цифр');
    if (!newBooking.photostudio.trim()) return alert('Фотостудия обязательна');
    if (!newBooking.printing.trim()) return alert('Типография обязательна');
    try {
      await axios.post('http://localhost:3001/api/booking-by-phone/phone/add', newBooking, { withCredentials: true });
      alert('Заявка успешно создана!');
      setNewBooking({ full_name: '', telephone: '', photostudio: '', printing: '', comment: '', status: '' });
      fetchPhoneRequests();
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
      <h2 className="requests-title">Заявки по телефону</h2>
      <button className="back-button" onClick={() => navigate(-1)}>Вернуться назад</button>

      <h3>Добавить заявку</h3>
      <form onSubmit={handleAddBooking} className="add-form">
        <input name="full_name" value={newBooking.full_name} onChange={handleNewBookingChange} placeholder="Имя клиента" required />
        <input name="telephone" value={newBooking.telephone} onChange={handleNewBookingChange} placeholder="Телефон" required />
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
          className="modal-input modal-textarea" // Добавляем классы для стиля
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
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {phoneBookings.map((booking) =>
              editingBooking && editingBooking.booking_by_phone_id === booking.booking_by_phone_id ? (
                <tr key={booking.booking_by_phone_id}>
                  <td>{booking.booking_by_phone_id}</td>
                  <td><input name="full_name" value={editingBooking.full_name} onChange={handleBookingChange} /></td>
                  <td><input name="telephone" value={editingBooking.telephone} onChange={handleBookingChange} /></td>
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
                      className="modal-input modal-textarea" // Добавляем классы для стиля
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
                  <td>
                    <span style={{ color: "#888" }}>Редактируется</span>
                  </td>
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
                  <td>
                    {/* Пусто, кнопки вынесены вниз */}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
      {selectedBookingId && !editingBooking && (
        <div className="action-buttons">
          <button onClick={() => handleEditBooking(phoneBookings.find(b => b.booking_by_phone_id === selectedBookingId))}>
            Редактировать
          </button>
          <button onClick={() => handleDeleteBooking(selectedBookingId)}>
            Удалить
          </button>
        </div>
      )}
      {editingBooking && (
        <div className="action-buttons">
          <button onClick={handleSaveBooking}>Сохранить</button>
          <button onClick={() => setEditingBooking(null)}>Отмена</button>
        </div>
      )}
    </div>
  );
};

export default PhoneRequests;
