import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Reviews.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ photostudio: '', printing: '', rating: '', comment: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [photostudios, setPhotostudios] = useState([]); // Состояние для списка фотостудий
  const [printings, setPrintings] = useState([]); // Состояние для списка типографий
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/reviews', {
          withCredentials: true,
        });
        setReviews(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке отзывов:', error);
        if (error.response && error.response.status === 403) {
          setErrorMessage('Вы не авторизованы. Пожалуйста, войдите в систему, чтобы оставить отзыв.');
        } else {
          setErrorMessage('Не удалось загрузить отзывы. Попробуйте позже.');
        }
      }
    };

    const fetchPhotostudios = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/photostudios');
        setPhotostudios(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке фотостудий:', error);
      }
    };

    const fetchPrintings = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/printing'); // Исправлен URL
        console.log('Данные типографий:', response.data); // Логирование данных
        setPrintings(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке типографий:', error);
      }
    };

    fetchReviews();
    fetchPhotostudios();
    fetchPrintings();

    axios.get('http://localhost:3001/api/auth/check', { withCredentials: true })
      .then(response => {
        setIsAuthenticated(response.data.isAuthenticated);
        setAuthChecked(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setAuthChecked(true);
      });
  }, []); // Убрано navigate из зависимостей, так как он не используется напрямую

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Проверка: хотя бы одно из двух полей выбрано
    if (!newReview.photostudio && !newReview.printing) {
      toast.error('Выберите фотостудию или типографию');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3001/api/reviews', newReview, {
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success('Отзыв успешно добавлен!');
        setReviews([...reviews, response.data.review]);
        setNewReview({ photostudio: '', printing: '', rating: '', comment: '' });
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Ошибка при добавлении отзыва:', error);
      if (error.response && error.response.status === 401) {
        toast.error('Вы не авторизованы. Пожалуйста, войдите в систему, чтобы оставить отзыв.');
        navigate('/login');
      } else {
        toast.error('Не удалось добавить отзыв. Попробуйте позже.');
      }
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      const response = await axios.delete(`http://localhost:3001/api/reviews/${reviewId}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        toast.success('Отзыв успешно удален!');
        setReviews((prevReviews) => prevReviews.filter((review) => review.review_id !== reviewId)); // Обновляем состояние
      }
    } catch (error) {
      console.error('Ошибка при удалении отзыва:', error);
      toast.error('Не удалось удалить отзыв. Попробуйте позже.');
    }
  };

  if (!authChecked) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="reviews-container">
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
      <h2>Отзывы о нашем сервисе</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <table>
        <thead>
          <tr>
            <th>Пользователь</th>
            <th>Оценка</th>
            <th>Отзыв</th>
            <th>Студия</th>
            <th>Типография</th>
            {isAuthenticated && <th>Действие</th>}
          </tr>
        </thead>
        <tbody>
          {reviews.map((review, index) => (
            <tr key={index}>
              <td>{review.User?.name || 'Не указано'}</td>
              <td>{review.rating || 'Не указано'}</td>
              <td>{review.comment || 'Не указано'}</td>
              <td>{review.photostudio || 'Не указано'}</td>
              <td>{review.printing || 'Не указано'}</td>
              {isAuthenticated && (
                <td>
                  <button
                    onClick={() => handleDelete(review.review_id)}
                    className="delete-button"
                  >
                    Удалить
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {!isAuthenticated && (
        <div>
          <div style={{ color: 'red', fontWeight: 600, textAlign: 'center', margin: '40px 0' }}>
            Для того, чтобы оставить отзыв, необходимо авторизоваться в системе.
          </div>
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <a href="/login">
              <button style={{ padding: '10px 24px', background: '#ffcc00', border: 'none', borderRadius: 5, fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>
                Войти
              </button>
            </a>
          </div>
        </div>
      )}

      {isAuthenticated && (
        <>
          {showAddForm ? (
            <>
              <h3>Добавить отзыв</h3>
              <form onSubmit={handleSubmit} className="review-form">
                <div className="input-group">
                  <label>Фотостудия</label>
                  <select
                    name="photostudio"
                    value={newReview.photostudio}
                    onChange={handleInputChange}
                  >
                    <option value="">—</option>
                    {photostudios.map((studio) => (
                      <option key={studio.id} value={studio.studio}>
                        {studio.studio}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label>Типография</label>
                  <select
                    name="printing"
                    value={newReview.printing}
                    onChange={handleInputChange}
                  >
                    <option value="">—</option>
                    {printings.map((printing) => (
                      <option key={printing.id} value={printing.main_album_name}>
                        {printing.main_album_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label>Оценка:</label>
                  <select
                    name="rating"
                    value={newReview.rating}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Выберите оценку</option>
                    <option value="плохо">1 – Плохо</option>
                    <option value="нормально">2 – Нормально</option>
                    <option value="хорошо">3 – Хорошо</option>
                    <option value="очень хорошо">4 – Очень хорошо</option>
                    <option value="отлично">5 – Отлично</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Комментарий</label>
                  <textarea
                    name="comment"
                    value={newReview.comment}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="add-role-button"
                >
                  Сохранить
                </button>
                <button
                  type="button"
                  className="edit-user-groups-button"
                  onClick={() => setShowAddForm(false)}
                >
                  Отмена
                </button>
              </form>
            </>
          ) : (
            <button
              className="add-role-button"
              onClick={() => setShowAddForm(true)}
            >
              Добавить отзыв
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Reviews;