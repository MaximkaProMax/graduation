import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log('Отправка данных на сервер:', { login: username, password });
      const response = await axios.post('http://localhost:3001/api/users/login', { login: username, password });
      console.log('Ответ от сервера:', response.data);

      if (response.data.success) {
        window.location.href = '/account';
      } else {
        setError(response.data.error || 'Неверный логин или пароль.');
      }
    } catch (error) {
      console.error('Произошла ошибка при попытке входа:', error);
      setError('Произошла ошибка при попытке входа. Пожалуйста, попробуйте позже.');
    }
  };

  const handleRegisterClick = () => {
    navigate('/registration');
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2>Авторизация</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Логин</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Войти</button>
          {error && <p className="error">{error}</p>}
        </form>
        <button className="register-button" onClick={handleRegisterClick}>Регистрация</button>
        <a className="forgot-password" href="/reset-password">Сброс пароля</a>
      </div>
    </div>
  );
}

export default Login;