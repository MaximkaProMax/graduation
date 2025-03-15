import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Manager.css';

const Manager = () => {
  const navigate = useNavigate();

  const handleRequestsClick = () => {
    navigate('/manager/requests');
  };

  const handlePersonalDataClick = () => {
    navigate('/manager/personal-data');
  };

  return (
    <div className="manager-container">
      <h2>Менеджер</h2>
      <button className="manager-button" onClick={handleRequestsClick}>Управление заявками на фотосессии</button>
      <button className="manager-button" onClick={handlePersonalDataClick}>Управление личными данными</button>
    </div>
  );
};

export default Manager;