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
        if (response.data.success && (response.data.role === 'Admin' || response.data.role === 'Manager')) {
          setIsAuthorized(true);
        } else {
          navigate('/'); // Перенаправляем на главную, если роль не "Admin" или "Manager"
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
    <div className="manager-container">
      <h2 className="manager-title">Страница менеджера</h2>
      <div className="manager-buttons">
        <button className="manager-button" onClick={handleRequestsClick}>
          Управление всеми заявками
        </button>
        <button className="manager-button" onClick={handleStudioRequestsClick}>
          Управление заявками фотостудий
        </button>
        <button className="manager-button" onClick={handleTypographyRequestsClick}>
          Управление заявками типографий
        </button>
        <button className="manager-button" onClick={handlePhoneRequestsClick}>
          Управление телефонными заявками
        </button>
      </div>
    </div>
  );
};

export default Manager;