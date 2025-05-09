import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ManagePermissions.css';

const ManagePermissions = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [newPage, setNewPage] = useState(''); // Для добавления новой страницы
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/api/users/check-role', { withCredentials: true })
      .then(response => {
        if (response.data.success && response.data.role === 'Admin') {
          setIsAuthorized(true);
          fetchRoles();
        } else {
          navigate('/'); // Перенаправляем на главную, если роль не "Admin"
        }
      })
      .catch(() => {
        navigate('/'); // Перенаправляем на главную при ошибке
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [navigate]);

  const fetchRoles = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/permissions');
      setRoles(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке ролей:', error);
    }
  };

  const handleRoleChange = (roleId) => {
    const role = roles.find(r => r.roleId === parseInt(roleId, 10));
    setSelectedRole(role);
    setPermissions(role.permissions?.[role.roleName] || []); // Получаем список страниц для выбранной роли
  };

  const handleAddPage = async () => {
    console.log('Попытка добавить новую страницу:', newPage); // Отладочное сообщение

    if (!newPage.trim()) {
      alert('Название страницы не может быть пустым');
      return;
    }
    if (permissions.includes(newPage)) {
      alert('Эта страница уже добавлена');
      return;
    }

    try {
      const updatedPermissions = [...permissions, newPage];
      console.log('Обновленные права доступа:', updatedPermissions); // Отладочное сообщение

      // Отправляем запрос на сервер для добавления страницы
      const response = await axios.put(`http://localhost:3001/api/roles/${selectedRole.roleId}`, {
        roleName: selectedRole.roleName, // Передаем имя роли
        permissions: { [selectedRole.roleName]: updatedPermissions }, // Передаем обновленный объект
      });

      console.log('Ответ от сервера при добавлении страницы:', response.data); // Отладочное сообщение

      if (response.data.success && response.data.role && response.data.role.permissions) {
        console.log('Сервер вернул обновленные данные:', response.data.role.permissions); // Отладочное сообщение
        setPermissions(response.data.role.permissions[selectedRole.roleName] || []);
        alert('Страница успешно добавлена в базу данных');
      } else {
        console.error('Ошибка: сервер не вернул обновленные данные. Ответ:', response.data); // Отладочное сообщение
        alert('Ошибка: сервер не вернул обновленные данные');
      }
    } catch (error) {
      console.error('Ошибка при добавлении страницы в базу данных:', error.response?.data || error.message);
      alert('Ошибка при добавлении страницы');
    }
  };

  const handleEditPage = (index) => {
    console.log(`Редактирование страницы: ${permissions[index]}`); // Отладочное сообщение
    const pageToEdit = permissions[index];
    setNewPage(pageToEdit); // Устанавливаем значение для редактирования
  };

  const handleDeletePage = async (index) => {
    const pageToDelete = permissions[index];
    console.log(`Удаление страницы: ${pageToDelete}`); // Отладочное сообщение
  
    try {
      // Отправляем запрос на сервер для удаления страницы
      await axios.delete(`http://localhost:3001/api/roles/${selectedRole.roleId}/page`, {
        data: { page: pageToDelete }, // Передаем страницу для удаления
        withCredentials: true,
      });
  
      // Удаляем страницу из локального состояния
      const updatedPermissions = permissions.filter((_, i) => i !== index);
      setPermissions(updatedPermissions); // Обновляем состояние
      alert(`Страница "${pageToDelete}" успешно удалена`);
    } catch (error) {
      console.error('Ошибка при удалении страницы:', error);
      alert('Ошибка при удалении страницы');
    }
  };

  const handleSavePermissions = async () => {
    try {
      // Отправляем запрос на сервер для сохранения изменений
      await axios.put(`http://localhost:3001/api/permissions/${selectedRole.roleId}`, {
        permissions: { [selectedRole.roleName]: permissions },
      });

      alert('Права успешно обновлены');
    } catch (error) {
      console.error('Ошибка при сохранении прав:', error);
      alert('Ошибка при сохранении прав');
    }
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!isAuthorized) {
    return null; // Не отображаем ничего, если пользователь не авторизован
  }

  return (
    <div className="manage-permissions-container">
      <h2>Управление правами доступа</h2>
      <button className="back-button" onClick={() => navigate(-1)}>Назад</button>
      <select onChange={(e) => handleRoleChange(e.target.value)}>
        <option value="">Выберите роль</option>
        {roles.map(role => (
          <option key={role.roleId} value={role.roleId}>{role.roleName}</option>
        ))}
      </select>
      {selectedRole && (
        <div>
          <h3>Доступные страницы для роли: {selectedRole.roleName}</h3>
          <ul>
            {permissions.map((page, index) => (
              <li key={index}>
                <span>{page}</span>
                <button onClick={() => handleEditPage(index)} className="edit-page-button">Редактировать</button>
                <button onClick={() => handleDeletePage(index)} className="delete-page-button">Удалить</button>
              </li>
            ))}
          </ul>
          <div className="add-page-form">
            <h4>Добавить новую страницу</h4>
            <input
              type="text"
              value={newPage}
              onChange={(e) => setNewPage(e.target.value)}
              placeholder="Введите название страницы"
              className="add-page-input"
            />
            <div className="form-actions">
              <button onClick={handleAddPage} className="add-page-button">Добавить</button>
              <button onClick={handleSavePermissions} className="save-permissions-button">Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePermissions;
