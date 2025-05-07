import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Подключаем стили Login.css

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

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
