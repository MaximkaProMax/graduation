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
        console.log('Ответ от API /check-role:', response.data); // Отладочное сообщение
        if (response.data.success && response.data.permissions.Admin) {
          setIsAuthorized(true);
        } else {
          console.warn('Доступ запрещен. Права доступа:', response.data.permissions); // Отладочное сообщение
          navigate('/'); // Перенаправляем на главную, если нет доступа
        }
      })
      .catch(error => {
        console.error('Ошибка при проверке роли пользователя:', error); // Отладочное сообщение
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
    <div className="admin-container" style={{
      maxWidth: 600,
      margin: '40px auto',
      padding: 32,
      backgroundColor: 'white',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.10)',
      borderRadius: 10,
      textAlign: 'center',
      minHeight: 420,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h2 style={{ marginBottom: 28 }}>Страница администратора</h2>
      <div className="admin-buttons" style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        alignItems: 'center'
      }}>
        <button className="admin-button" style={{ width: '100%', maxWidth: 500 }} onClick={() => navigate('/edit-user-groups')}>Редактировать группы пользователей</button>
        <button className="admin-button" style={{ width: '100%', maxWidth: 500 }} onClick={() => navigate('/admin/edit-users')}>Редактировать пользователей</button>
        <button className="admin-button" style={{ width: '100%', maxWidth: 500 }} onClick={() => navigate('/admin/edit-database')}>Редактировать базы данных</button>
        <button className="admin-button" style={{ width: '100%', maxWidth: 500 }} onClick={() => navigate('/admin/manage-permissions')}>Управление правами</button>
      </div>
    </div>
  );
};

export default Admin;