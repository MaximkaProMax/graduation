import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditPersonalData.css';
import { useNavigate } from 'react-router-dom';

const EditPersonalData = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = () => {
    axios.get('http://localhost:3001/api/users/user', { withCredentials: true })
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.error('Ошибка при получении данных пользователя:', error);
      });
  };

  const handleEditUser = () => {
    const userName = prompt('Введите новое ФИО пользователя:', user.name);
    const userLogin = prompt('Введите новый логин пользователя:', user.login);
    const userPhone = prompt('Введите новый телефон пользователя:', user.telephone);
    const userPassword = prompt('Введите новый пароль пользователя:');
    const userEmail = prompt('Введите новый email пользователя:', user.email);

    if (userName && userLogin && userPhone && userPassword && userEmail) {
      axios.put('http://localhost:3001/api/users/user', {
        name: userName,
        login: userLogin,
        telephone: userPhone,
        password: userPassword,
        email: userEmail,
      }, { withCredentials: true })
        .then(() => {
          console.log('Данные пользователя успешно обновлены');
          fetchUserData();
        })
        .catch(error => {
          console.error('Ошибка при обновлении данных пользователя:', error);
        });
    }
  };

  const handleBackClick = () => {
    navigate('/profile'); // Переход на страницу Profile.js
  };

  return (
    <div className="edit-personal-data-container">
      <h2>Редактирование личных данных</h2>
      <button className="back-button" onClick={handleBackClick}>Вернуться назад</button>
      <table className="edit-personal-data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>ФИО</th>
            <th>Логин</th>
            <th>Телефон</th>
            <th>Email</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{user.userId}</td>
            <td>{user.name}</td>
            <td>{user.login}</td>
            <td>{user.telephone}</td>
            <td>{user.email}</td>
            <td>
              <button className="edit-personal-data-button" onClick={handleEditUser}>Редактировать</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EditPersonalData;