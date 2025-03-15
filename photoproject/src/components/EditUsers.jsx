import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditUsers.css';
import { useNavigate } from 'react-router-dom';

const EditUsers = () => {
  const [users, setUsers] = useState([]);
  const [editableUser, setEditableUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableUser({ ...editableUser, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === 'currentPassword') {
      setCurrentPassword(value);
    } else if (name === 'newPassword') {
      setNewPassword(value);
    } else if (name === 'confirmNewPassword') {
      setConfirmNewPassword(value);
    }
  };

  const handleSaveUser = () => {
    const { userId, name, login, telephone, email } = editableUser;

    if (name && login && telephone && email) {
      const updateData = {
        name,
        login,
        telephone,
        email,
        currentPassword,
        newPassword,
      };

      if (currentPassword && newPassword && confirmNewPassword) {
        if (newPassword !== confirmNewPassword) {
          setErrorMessage('Новый пароль и подтверждение пароля не совпадают');
          setSuccessMessage('');
          return;
        }
      }

      console.log('Отправка данных на сервер:', updateData);

      axios.put(`http://localhost:3001/api/users/${userId}`, updateData)
        .then(response => {
          if (response.data.success) {
            console.log('Данные пользователя успешно обновлены');
            fetchUsers();
            setIsEditing(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setErrorMessage('');
            setSuccessMessage('Данные пользователя успешно обновлены');
          } else {
            setErrorMessage(response.data.message || 'Ошибка при обновлении данных пользователя');
            setSuccessMessage('');
          }
        })
        .catch(error => {
          if (error.response && error.response.status === 400) {
            setErrorMessage('Текущий пароль неверен');
          } else {
            setErrorMessage('Ошибка при обновлении данных пользователя');
          }
          setSuccessMessage('');
          console.error('Ошибка при обновлении данных пользователя:', error);
        });
    } else {
      setErrorMessage('Все поля должны быть заполнены');
      setSuccessMessage('');
    }
  };

  const handleEditUser = (user) => {
    setEditableUser(user);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditableUser({});
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setErrorMessage('');
    setSuccessMessage('');
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

  const handleAddUser = () => {
    setEditableUser({ userId: null, name: '', login: '', telephone: '', email: '', password: '' });
    setIsEditing(true);
  };

  const handleBackClick = () => {
    navigate('/admin'); // Переход на страницу Admin.js
  };

  return (
    <div className="edit-users-container">
      <h2>Редактирование пользователей</h2>
      <button className="back-button" onClick={handleBackClick}>Вернуться назад</button>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
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
              <td>
                {isEditing && editableUser.userId === user.userId ? (
                  <input
                    type="text"
                    name="name"
                    value={editableUser.name || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  user.name
                )}
              </td>
              <td>
                {isEditing && editableUser.userId === user.userId ? (
                  <input
                    type="text"
                    name="login"
                    value={editableUser.login || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  user.login
                )}
              </td>
              <td>
                {isEditing && editableUser.userId === user.userId ? (
                  <input
                    type="text"
                    name="telephone"
                    value={editableUser.telephone || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  user.telephone
                )}
              </td>
              <td>
                {isEditing && editableUser.userId === user.userId ? (
                  <input
                    type="email"
                    name="email"
                    value={editableUser.email || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {isEditing && editableUser.userId === user.userId ? (
                  <>
                    <button className="edit-users-button" onClick={handleSaveUser}>Сохранить</button>
                    <button className="edit-users-button" onClick={handleCancelEdit}>Отмена</button>
                  </>
                ) : (
                  <>
                    <button className="edit-users-button" onClick={() => handleEditUser(user)}>Редактировать</button>
                    <button className="edit-users-button" onClick={() => handleDeleteUser(user.userId)}>Удалить</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isEditing && editableUser.userId === null && (
        <div className="add-user-form">
          <h3>Добавить пользователя</h3>
          <div className="input-group">
            <label>ФИО</label>
            <input
              type="text"
              name="name"
              value={editableUser.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-group">
            <label>Логин</label>
            <input
              type="text"
              name="login"
              value={editableUser.login}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-group">
            <label>Телефон</label>
            <input
              type="text"
              name="telephone"
              value={editableUser.telephone}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={editableUser.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-group">
            <label>Пароль</label>
            <input
              type="password"
              name="password"
              value={editableUser.password}
              onChange={handleInputChange}
            />
          </div>
          <button className="edit-users-button" onClick={handleSaveUser}>Сохранить</button>
          <button className="edit-users-button" onClick={handleCancelEdit}>Отмена</button>
        </div>
      )}
      <button className="add-user-button" onClick={handleAddUser}>Добавить пользователя</button>
    </div>
  );
};

export default EditUsers;