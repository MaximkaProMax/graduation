import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Registration.css';
import Modal from 'react-modal'; // Добавлено для модального окна

const Registration = () => {
  const [name, setName] = useState(''); // Переименовано с fullName на name
  const [login, setLogin] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState(''); // Новое состояние для адреса
  const [error, setError] = useState('');
  const [successModalOpen, setSuccessModalOpen] = useState(false); // Модальное окно
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const userData = { name, login, phone, email, password, address, role: 'user' }; // добавили address

    try {
      console.log('Отправка данных на сервер:', userData);
      const response = await axios.post('http://localhost:3001/api/users/register', userData); // Убедитесь, что URL верный
      console.log('Ответ от сервера:', response.data);

      if (response.data.success) {
        setSuccessModalOpen(true); // Открываем модальное окно
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
      <Modal
        isOpen={successModalOpen}
        onRequestClose={() => {
          setSuccessModalOpen(false);
          navigate('/login');
        }}
        className="modal"
        overlayClassName="overlay"
        ariaHideApp={false}
      >
        <h2>Регистрация успешна!</h2>
        <p>Вы успешно зарегистрированы. Теперь вы можете войти в систему.</p>
        <button
          className="submit-button"
          onClick={() => {
            setSuccessModalOpen(false);
            navigate('/login');
          }}
        >
          Перейти к авторизации
        </button>
      </Modal>
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
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={phone}
              onChange={e => {
                const onlyDigits = e.target.value.replace(/\D/g, '');
                setPhone(onlyDigits);
              }}
              required
            />
          </div>
          <div className="input-group">
            <label>Адрес</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
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