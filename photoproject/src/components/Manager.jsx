import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Manager.css';

const Manager = () => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3001/api/users/check-role', { withCredentials: true })
      .then(response => {
        console.log('Ответ от API /check-role:', response.data); // Отладочное сообщение
        if (response.data.success && (response.data.permissions.Manager || response.data.permissions.Admin)) {
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

  const handleRequestsClick = () => {
    navigate('/manager/requests');
  };

  const handlePersonalDataClick = () => {
    navigate('/manager/edit-personal-data');
  };

  const handleStudioRequestsClick = () => {
    navigate('/manager/photostudio-requests');
  };

  const handleTypographyRequestsClick = () => {
    navigate('/manager/printinghouse-requests');
  };

  const handlePhoneRequestsClick = () => {
    navigate('/manager/phone-requests');
  };

  return (
    <div className="manager-container" style={{
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
      <h2 style={{ marginBottom: 28 }}>Страница менеджера</h2>
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        alignItems: 'center'
      }}>
        <button className="manager-button" onClick={handleRequestsClick}>Управление всеми заявками</button>
        <button className="manager-button" onClick={handleStudioRequestsClick}>Управление заявками фотостудий</button>
        <button className="manager-button" onClick={handleTypographyRequestsClick}>Управление заявками типографий</button>
        <button className="manager-button" onClick={handlePhoneRequestsClick}>Управление телефонными заявками</button>
      </div>
    </div>
  );
};

export default Manager;