import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/EditPersonalData.css';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    const { name, login, telephone, email, address } = editableUser;

    if (name && login && telephone && email && address !== undefined) {
      const updateData = {
        name,
        login,
        telephone,
        email,
        address,
        currentPassword,
        newPassword,
      };

      if (currentPassword && newPassword && confirmNewPassword) {
        if (newPassword !== confirmNewPassword) {
          setErrorMessage('Новый пароль и подтверждение пароля не совпадают');
          setSuccessMessage('');
          toast.error('Новый пароль и подтверждение пароля не совпадают');
          return;
        }
      }

      axios.put('http://localhost:3001/api/users/update-password', updateData, { withCredentials: true })
        .then(response => {
          if (response.data.success) {
            fetchUserData();
            setIsEditing(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setErrorMessage('');
            setSuccessMessage('');
            // Показываем toast для каждого измененного поля
            if (user.name !== name) toast.success('ФИО успешно изменено!');
            if (user.login !== login) toast.success('Логин успешно изменён!');
            if (user.telephone !== telephone) toast.success('Телефон успешно изменён!');
            if (user.email !== email) toast.success('Email успешно изменён!');
            if (user.address !== address) toast.success('Адрес успешно изменён!');
            if (currentPassword && newPassword) toast.success('Пароль успешно изменён!');
          } else {
            setErrorMessage(response.data.message || 'Ошибка при обновлении данных пользователя');
            setSuccessMessage('');
            toast.error(response.data.message || 'Ошибка при обновлении данных пользователя');
          }
        })
        .catch(error => {
          if (error.response && error.response.status === 400) {
            setErrorMessage('Текущий пароль неверен');
            toast.error('Текущий пароль неверен');
          } else {
            setErrorMessage('Ошибка при обновлении данных пользователя');
            toast.error('Ошибка при обновлении данных пользователя');
          }
          setSuccessMessage('');
        });
    } else {
      setErrorMessage('Все поля должны быть заполнены');
      setSuccessMessage('');
      toast.error('Все поля должны быть заполнены');
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
      <ToastContainer position="top-center" autoClose={3000} />
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
              <th>Адрес</th>
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
                  onChange={e => {
                    // Оставляем только цифры
                    const onlyDigits = e.target.value.replace(/\D/g, '');
                    setEditableUser({ ...editableUser, telephone: onlyDigits });
                  }}
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
              <td>
                <input
                  type="text"
                  name="address"
                  value={editableUser.address || ''}
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