import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PersonalData.css';

const PersonalData = () => {
  const navigate = useNavigate();

  const handleChangePassword = () => {
    // Логика для изменения пароля
  };

  const handleEditPersonalData = () => {
    // Логика для редактирования личных данных
  };

  const handleViewRequests = () => {
    navigate('/manager/requests'); // Переход на страницу заявок
  };

  return (
    <div className="personal-data-container">
      <h2>Управление личными данными</h2>
      <div className="buttons-container">
        <button className="personal-data-button" onClick={handleChangePassword}>Изменение пароля</button>
        <button className="personal-data-button" onClick={handleEditPersonalData}>Редактирование личных данных</button>
        <button className="personal-data-button" onClick={handleViewRequests}>Просмотр заявок</button>
      </div>
    </div>
  );
};

export default PersonalData;