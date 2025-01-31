import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-container">
      <h2>Страница администратора</h2>
      <div className="admin-buttons">
        <button className="admin-button" onClick={() => navigate('/edit-user-groups')}>Редактировать группы пользователей</button>
        <button className="admin-button">Редактировать пользователей</button>
        <button className="admin-button">Редактировать базы данных</button>
      </div>
    </div>
  );
};

export default Admin;