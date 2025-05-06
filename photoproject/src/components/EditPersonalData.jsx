import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditPersonalData.css';
import { useNavigate } from 'react-router-dom';

const EditPersonalData = () => {
  const [user, setUser] = useState({});
  const [editableUser, setEditableUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = () => {
    axios.get('http://localhost:3001/api/users/user', { withCredentials: true })
      .then(response => {
        setUser(response.data);
        setEditableUser(response.data);
      })
      .catch(error => {
        console.error('Ошибка при получении данных пользователя:', error);
        setErrorMessage('Ошибка при получении данных пользователя');
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
    const { name, login, telephone, email } = editableUser;

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

      axios.put('http://localhost:3001/api/users/update-password', updateData, { withCredentials: true })
        .then(response => {
          if (response.data.success) {
            console.log('Данные пользователя успешно обновлены');
            fetchUserData();
            setIsEditing(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setErrorMessage('');
            setSuccessMessage('Пароль успешно изменен');
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

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setEditableUser(user);
    setIsEditing(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleBackClick = () => {
    navigate('/'); // Переход на главную страницу
  };

  return (
    <div className="edit-personal-data-container">
      <h2>Редактирование личных данных</h2>
      <button className="back-button" onClick={handleBackClick}>Вернуться на главную</button>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <div className="table-container">
        <table className="edit-personal-data-table">
          <thead>
            <tr>
              <th>ФИО</th>
              <th>Логин</th>
              <th>Телефон</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  name="name"
                  value={editableUser.name || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="login"
                  value={editableUser.login || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="telephone"
                  value={editableUser.telephone || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </td>
              <td>
                <input
                  type="email"
                  name="email"
                  value={editableUser.email || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {isEditing && (
        <div className="password-change-container">
          <div className="form-group">
            <label htmlFor="currentPassword">Текущий пароль</label>
            <input
              type="password"
              name="currentPassword"
              value={currentPassword}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">Новый пароль</label>
            <input
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmNewPassword">Подтвердите новый пароль</label>
            <input
              type="password"
              name="confirmNewPassword"
              value={confirmNewPassword}
              onChange={handlePasswordChange}
            />
          </div>
        </div>
      )}
      <div className="button-container">
        {isEditing ? (
          <>
            <button className="edit-personal-data-button" onClick={handleSaveUser}>Сохранить</button>
            <button className="edit-personal-data-button" onClick={handleCancelClick}>Отмена</button>
          </>
        ) : (
          <button className="edit-personal-data-button" onClick={handleEditClick}>Редактировать</button>
        )}
      </div>
    </div>
  );
};

export default EditPersonalData;