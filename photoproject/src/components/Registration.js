import React, { useState } from 'react';
import axios from 'axios';
import './Registration.css'; // Не забываем о стилях

const Registration = () => {
  const [fullName, setFullName] = useState('');
  const [login, setLogin] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    const userData = { fullName, login, phone, password };

    try {
      const response = await axios.post('/api/register', userData); // Замените URL на нужный
      console.log('Registration Successful:', response.data);
      alert('Регистрация успешна!');
      // Здесь вы можете направлять пользователя на страницу авторизации или куда-то еще
    } catch (error) {
      console.error('Registration Error:', error);
      alert('Ошибка регистрации. Пожалуйста, попробуйте еще раз.');
    }
  };

  return (
    <div className="registration-wrapper">
      <div className="registration-container">
        <h2>Регистрация</h2>
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label>ФИО</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Логин</label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Телефон</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Зарегистрироваться</button>
        </form>
      </div>
    </div>
  );
};

export default Registration;