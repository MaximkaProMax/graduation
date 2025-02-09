import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [isTwoFactorRequired, setIsTwoFactorRequired] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log('Отправка данных на сервер:', { email, password });
      const response = await axios.post('http://localhost:3001/api/users/login', 
        { email, password },
        { withCredentials: true } // Добавляем опцию для отправки cookies
      );
      console.log('Ответ от сервера:', response.data);

      if (response.data.twoFactorRequired) {
        setIsTwoFactorRequired(true);
      } else {
        navigate('/manager/personal-data'); // Перенаправление на личные данные
      }
    } catch (error) {
      console.error('Произошла ошибка при попытке входа:', error);
      setErrorMessage('Произошла ошибка при попытке входа. Пожалуйста, попробуйте позже.');
    }
  };

  const handleVerifyTwoFactorCode = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/users/verify-2fa-code', 
        { code: twoFactorCode, email },
        { withCredentials: true } // Добавляем опцию для отправки cookies
      );
      if (response.data.success) {
        navigate('/manager/personal-data'); // Успешный вход
      } else {
        setErrorMessage('Неверный код');
      }
    } catch (error) {
      setErrorMessage('Ошибка при проверке кода');
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
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          {isTwoFactorRequired && (
            <div className="input-group">
              <label>Код 2FA</label>
              <input
                type="text"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
              />
              <button type="button" onClick={handleVerifyTwoFactorCode}>Подтвердить</button>
            </div>
          )}
          {errorMessage && <p className="error">{errorMessage}</p>}
        </form>
        <button className="register-button" onClick={handleRegisterClick}>Регистрация</button>
        <a className="forgot-password" href="/reset-password">Сброс пароля</a>
      </div>
    </div>
  );
}

export default Login;