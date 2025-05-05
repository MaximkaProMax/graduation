import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Manager.css';

const Manager = () => {
  const navigate = useNavigate();

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
      <h2 style={{ marginBottom: 28 }}>Менеджер</h2>
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        alignItems: 'center'
      }}>
        <button className="manager-button" style={{ width: '100%', maxWidth: 500 }} onClick={handleRequestsClick}>Управление всеми заявками</button>
        <button className="manager-button" style={{ width: '100%', maxWidth: 500 }} onClick={handleStudioRequestsClick}>Управление заявками фотостудий</button>
        <button className="manager-button" style={{ width: '100%', maxWidth: 500 }} onClick={handleTypographyRequestsClick}>Управление заявками типографий</button>
      </div>
    </div>
  );
};

export default Manager;