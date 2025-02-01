import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditUsers.css';
import { useNavigate } from 'react-router-dom';

const EditUsers = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get('http://localhost:3001/api/users')
      .then(response => {
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        }
      })
      .catch(error => {
        console.error('Ошибка при получении данных о пользователях:', error);
      });
  };

  const handleAddUser = () => {
    const userName = prompt('Введите ФИО нового пользователя:');
    const userLogin = prompt('Введите логин нового пользователя:');
    const userPhone = prompt('Введите телефон нового пользователя:');
    const userPassword = prompt('Введите пароль нового пользователя:');
    const userEmail = prompt('Введите email нового пользователя:');

    if (userName && userLogin && userPhone && userPassword && userEmail) {
      axios.post('http://localhost:3001/api/users', {
        name: userName,
        login: userLogin,
        telephone: userPhone,
        password: userPassword,
        email: userEmail,
      })
        .then(() => {
          console.log('Пользователь успешно добавлен');
          fetchUsers();
        })
        .catch(error => {
          console.error('Ошибка при добавлении пользователя:', error);
        });
    }
  };

  const handleEditUser = (userId) => {
    const userName = prompt('Введите новое ФИО пользователя:');
    const userLogin = prompt('Введите новый логин пользователя:');
    const userPhone = prompt('Введите новый телефон пользователя:');
    const userPassword = prompt('Введите новый пароль пользователя:');
    const userEmail = prompt('Введите новый email пользователя:');

    if (userName && userLogin && userPhone && userPassword && userEmail) {
      axios.put(`http://localhost:3001/api/users/${userId}`, {
        name: userName,
        login: userLogin,
        telephone: userPhone,
        password: userPassword,
        email: userEmail,
      })
        .then(() => {
          console.log('Пользователь успешно отредактирован');
          fetchUsers();
        })
        .catch(error => {
          console.error('Ошибка при редактировании пользователя:', error);
        });
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      axios.delete(`http://localhost:3001/api/users/${userId}`)
        .then(() => {
          console.log('Пользователь успешно удален');
          fetchUsers();
        })
        .catch(error => {
          console.error('Ошибка при удалении пользователя:', error);
        });
    }
  };

  const handleBackClick = () => {
    navigate('/admin'); // Переход на страницу Admin.js
  };

  return (
    <div className="edit-users-container">
      <h2>Редактирование пользователей</h2>
      <button className="back-button" onClick={handleBackClick}>Вернуться назад</button>
      <table className="edit-users-table">
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
          {users.map((user) => (
            <tr key={user.userId}>
              <td>{user.userId}</td>
              <td>{user.name}</td>
              <td>{user.login}</td>
              <td>{user.telephone}</td>
              <td>{user.email}</td>
              <td>
                <button className="edit-users-button" onClick={() => handleEditUser(user.userId)}>Редактировать</button>
                <button className="edit-users-button" onClick={() => handleDeleteUser(user.userId)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="add-user-button" onClick={handleAddUser}>Добавить пользователя</button>
    </div>
  );
};

export default EditUsers;