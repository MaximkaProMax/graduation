import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/EditUsers.css';
import { useNavigate } from 'react-router-dom';
import { checkPageAccess } from '../../utils/checkPageAccess';
import Modal from 'react-modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditUsers = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]); // список ролей из БД
  const [editableUser, setEditableUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, userId: null });
  const navigate = useNavigate();

  const fetchUsers = () => {
    axios.get('http://localhost:3001/api/users')
      .then(response => {
        if (Array.isArray(response.data)) {
          // Сортировка по userId от меньшего к большому
          const sorted = [...response.data].sort((a, b) => a.userId - b.userId);
          setUsers(sorted);
        }
      })
      .catch(error => {
        console.error('Ошибка при получении данных о пользователях:', error);
      });
  };

  const fetchRoles = () => {
    axios.get('http://localhost:3001/api/roles')
      .then(response => {
        setRoles(response.data);
      })
      .catch(error => {
        console.error('Ошибка при получении ролей:', error);
      });
  };

  useEffect(() => {
    checkPageAccess('EditUsers', navigate, setIsAuthorized, setIsLoading);
  }, [navigate]);

  useEffect(() => {
    if (isAuthorized) {
      fetchUsers();
      fetchRoles();
    }
  }, [isAuthorized]);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!isAuthorized) {
    return null; // Не отображаем ничего, если пользователь не авторизован
  }

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
    const { userId, name, login, telephone, email, address, roleId, password } = editableUser;

    if (userId === null) {
      // Добавление нового пользователя
      if (!name || !login || !telephone || !email || !password || !roleId) {
        setErrorMessage('Все поля должны быть заполнены');
        setSuccessMessage('');
        return;
      }
      axios.post('http://localhost:3001/api/users', {
        name,
        login,
        telephone,
        email,
        password,
        address, // <--- добавлено!
        roleId: parseInt(roleId, 10)
      })
        .then(response => {
          if (response.data.success) {
            fetchUsers();
            setIsEditing(false);
            setEditableUser({});
            setErrorMessage('');
            setSuccessMessage('Пользователь успешно добавлен');
            toast.success('Пользователь успешно добавлен!');
          } else {
            setErrorMessage(response.data.message || 'Ошибка при добавлении пользователя');
            setSuccessMessage('');
            toast.error(response.data.message || 'Ошибка при добавлении пользователя');
          }
        })
        .catch(error => {
          setErrorMessage('Ошибка при добавлении пользователя');
          setSuccessMessage('');
          toast.error('Ошибка при добавлении пользователя');
          console.error('Ошибка при добавлении пользователя:', error);
        });
      return;
    }

    // Редактирование существующего пользователя
    if (name && login && telephone && email && roleId) {
      const updateData = {
        name,
        login,
        telephone,
        email,
        address, // <--- добавлено!
        roleId: parseInt(roleId, 10), // Преобразуем roleId в число
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

      axios.put(`http://localhost:3001/api/users/${userId}`, updateData)
        .then(response => {
          if (response.data.success) {
            fetchUsers();
            setIsEditing(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setErrorMessage('');
            setSuccessMessage('Данные пользователя успешно обновлены');
            toast.success('Данные пользователя успешно обновлены!');
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
          console.error('Ошибка при обновлении данных пользователя:', error);
        });
    } else {
      setErrorMessage('Все поля должны быть заполнены');
      setSuccessMessage('');
      toast.error('Все поля должны быть заполнены');
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

  const openDeleteModal = (userId) => setDeleteModal({ open: true, userId });
  const closeDeleteModal = () => setDeleteModal({ open: false, userId: null });

  const confirmDelete = async () => {
    if (!deleteModal.userId) return closeDeleteModal();
    try {
      await axios.delete(`http://localhost:3001/api/users/${deleteModal.userId}`);
      fetchUsers();
      toast.success('Пользователь успешно удалён!');
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error);
      toast.error('Ошибка при удалении пользователя');
    } finally {
      closeDeleteModal();
    }
  };

  const handleAddUser = () => {
    setEditableUser({ userId: null, name: '', login: '', telephone: '', email: '', address: '', password: '', roleId: '' });
    setIsEditing(true);
  };

  const handleBackClick = () => {
    navigate('/admin'); // Переход на страницу Admin.js
  };

  return (
    <div className="edit-users-container">
      <ToastContainer position="top-center" autoClose={3000} />
      {/* Модальное окно подтверждения удаления */}
      <Modal
        isOpen={deleteModal.open}
        onRequestClose={closeDeleteModal}
        className="modal"
        overlayClassName="overlay"
        ariaHideApp={false}
      >
        <h2>Подтвердите удаление</h2>
        <p>Вы уверены, что хотите удалить этого пользователя?</p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 24 }}>
          <button className="submit-button" style={{ minWidth: 120 }} onClick={confirmDelete}>Удалить</button>
          <button className="submit-button" style={{ minWidth: 120, background: '#ccc', color: '#222' }} onClick={closeDeleteModal}>Отмена</button>
        </div>
      </Modal>
      <h2>Редактирование пользователей</h2>
      <button className="back-button" onClick={handleBackClick}>Вернуться назад</button>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      {/* Карточка для таблицы */}
      <div className="requests-orders-card">
        <div className="edit-users-table-wrapper">
          <table className="edit-users-table requests-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>ФИО</th>
                <th>Логин</th>
                <th>Телефон</th>
                <th>Email</th>
                <th>Адрес</th>
                <th>Роль</th>
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
                        type="number"
                        name="telephone"
                        value={editableUser.telephone || ''}
                        onChange={e => {
                          // Оставляем только цифры
                          const onlyDigits = e.target.value.replace(/\D/g, '');
                          setEditableUser({ ...editableUser, telephone: onlyDigits });
                        }}
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
                      <input
                        type="text"
                        name="address"
                        value={editableUser.address || ''}
                        onChange={handleInputChange}
                      />
                    ) : (
                      user.address
                    )}
                  </td>
                  <td>
                    {isEditing && editableUser.userId === user.userId ? (
                      <select
                        name="roleId"
                        value={editableUser.roleId || ''}
                        onChange={handleInputChange}
                      >
                        <option value="">Выберите роль</option>
                        {roles.map(role => (
                          <option key={role.roleId} value={role.roleId}>
                            {role.roleId} — {role.roleName}
                          </option>
                        ))}
                      </select>
                    ) : (
                      (() => {
                        const role = roles.find(r => r.roleId === user.roleId);
                        return role ? `${role.roleId} — ${role.roleName}` : user.roleId;
                      })()
                    )}
                  </td>
                  <td>
                    {isEditing && editableUser.userId === user.userId ? (
                      <>
                        <button className="edit-users-button edit" onClick={handleSaveUser}>Сохранить</button>
                        <button className="edit-users-button" onClick={handleCancelEdit}>Отмена</button>
                      </>
                    ) : (
                      <>
                        <button className="edit-users-button edit" onClick={() => handleEditUser(user)}>Редактировать</button>
                        <button className="edit-users-button delete" onClick={() => openDeleteModal(user.userId)}>Удалить</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isEditing && editableUser.userId === null && (
        <div className="add-user-form requests-add-card">
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
              type="number"
              name="telephone"
              value={editableUser.telephone}
              onChange={e => {
                // Оставляем только цифры
                const onlyDigits = e.target.value.replace(/\D/g, '');
                setEditableUser({ ...editableUser, telephone: onlyDigits });
              }}
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
            <label>Адрес</label>
            <input
              type="text"
              name="address"
              value={editableUser.address || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-group">
            <label>Роль</label>
            <select
              name="roleId"
              value={editableUser.roleId}
              onChange={handleInputChange}
            >
              <option value="">Выберите роль</option>
              {roles.map(role => (
                <option key={role.roleId} value={role.roleId}>
                  {role.roleId} — {role.roleName}
                </option>
              ))}
            </select>
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
          <button className="edit-users-button edit" onClick={handleSaveUser}>Сохранить</button>
          <button className="edit-users-button" onClick={handleCancelEdit}>Отмена</button>
        </div>
      )}
      {!(isEditing && editableUser.userId === null) && (
        <button className="add-user-button" onClick={handleAddUser}>Добавить пользователя</button>
      )}
    </div>
  );
};

export default EditUsers;