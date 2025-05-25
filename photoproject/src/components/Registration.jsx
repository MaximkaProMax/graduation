import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Registration.css';

const Registration = () => {
  const [name, setName] = useState(''); // Переименовано с fullName на name
  const [login, setLogin] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const userData = { name, login, phone, email, password, role: 'user' }; // Переименовано с fullName на name

    try {
      console.log('Отправка данных на сервер:', userData);
      const response = await axios.post('http://localhost:3001/api/users/register', userData); // Убедитесь, что URL верный
      console.log('Ответ от сервера:', response.data);

      if (response.data.success) {
        alert('Регистрация успешна!');
        navigate('/login');
      } else {
        setError(response.data.error || 'Ошибка регистрации. Пожалуйста, попробуйте ещё раз.');
      }
    } catch (error) {
      console.error('Произошла ошибка при отправке запроса:', error);
      setError('Произошла ошибка при попытке регистрации. Пожалуйста, попробуйте позже.');
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
              value={name} // Переименовано с fullName на name
              onChange={(e) => setName(e.target.value)} // Переименовано с setFullName на setName
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
          <div className="input-group"> {/* Поле для электронной почты */}
            <label>Почта</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          {error && <p className="error">{error}</p>}
          <button type="submit">Зарегистрироваться</button>
        </form>
      </div>
    </div>
  );
};

export default Registration;