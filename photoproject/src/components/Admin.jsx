import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();

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
      </div>
    </div>
  );
};

export default Admin;