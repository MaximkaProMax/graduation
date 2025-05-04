import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PersonalData.css';

const PersonalData = () => {
  const navigate = useNavigate();

  const handleEditPersonalData = () => {
    navigate('/manager/edit-personal-data'); // Переход на страницу редактирования личных данных
  };

  return (
    <div className="personal-data-container">
      <h2>Управление личными данными</h2>
      <div className="buttons-container">
        <button className="personal-data-button" onClick={handleEditPersonalData}>Редактирование личных данных</button>
        {/* Кнопка "Просмотр заявок" удалена */}
      </div>
    </div>
  );
};

export default PersonalData;