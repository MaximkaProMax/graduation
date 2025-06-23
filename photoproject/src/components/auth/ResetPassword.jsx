import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Импорт useNavigate
import '../styles/Login.css'; // Подключаем стили Login.css

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate(); // Инициализация useNavigate
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:3001/api/users/reset-password/${token}`, { newPassword });
      setMessage(response.data.message);

      if (response.data.success) {
        setTimeout(() => navigate('/login'), 2000); // Переход на страницу Login через 2 секунды
      }
    } catch (error) {
      setMessage('Ошибка при сбросе пароля. Попробуйте позже.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <button className="back-button" onClick={() => navigate('/login')}>Назад</button> {/* Кнопка назад */}
        <h2>Введите новый пароль</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Новый пароль</label>
            <input
              type="password"
              placeholder="Введите новый пароль"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Сбросить пароль</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
