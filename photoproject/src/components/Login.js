import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', {
        username,
        password,
      });

      if (response.data.success) {
        // Redirect to the user's account page
        window.location.href = '/account';
      } else {
        setError(response.data.message || 'Пользователь не существует. Пожалуйста, зарегистрируйтесь.');
      }
    } catch (error) {
      setError('Произошла ошибка при попытке входа. Пожалуйста, попробуйте позже.');
    }
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
        </form>
        {error && <p className="error">{error}</p>}
        <a href="/reset-password">Сброс пароля</a>
      </div>
    </div>
  );
}

export default Login;