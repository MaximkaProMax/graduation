import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Импорт useNavigate
import axios from 'axios';
import './Login.css'; // Подключаем стили Login.css

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Инициализация useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/users/forgot-password', { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Ошибка при отправке письма. Попробуйте позже.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <button className="back-button" onClick={() => navigate('/login')}>Назад</button> {/* Кнопка назад */}
        <h2>Сброс пароля</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Введите ваш email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit">Отправить</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
