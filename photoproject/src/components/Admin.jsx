import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3001/api/users/check-role', { withCredentials: true })
      .then(response => {
        if (response.data.success && response.data.role === 'Admin') {
          setIsAuthorized(true);
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

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!isAuthorized) {
    return null; // Не отображаем ничего, если пользователь не авторизован
  }

  return (
    <div className="admin-container">
      <h2 className="admin-title">Страница администратора</h2>
      <div className="admin-buttons">
        <button className="admin-button" onClick={() => navigate('/edit-user-groups')}>Редактировать группы пользователей</button>
        <button className="admin-button" onClick={() => navigate('/admin/edit-users')}>Редактировать пользователей</button>
        <button className="admin-button" onClick={() => navigate('/admin/edit-database')}>Редактировать базы данных</button>
        <button className="admin-button" onClick={() => navigate('/admin/create-items')}>Создание элементов</button>
      </div>
    </div>
  );
};

export default Admin;