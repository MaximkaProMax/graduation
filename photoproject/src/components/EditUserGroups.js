import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditUserGroups.css';
import { useNavigate } from 'react-router-dom';

const EditUserGroups = () => {
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = () => {
    axios.get('http://localhost:3001/api/roles')
      .then(response => {
        if (Array.isArray(response.data)) {
          setRoles(response.data);
        }
      })
      .catch(error => {
        console.error('Ошибка при получении данных о ролях:', error);
      });
  };

  const handleAddRole = () => {
    const roleName = prompt('Введите название новой группы:');
    if (roleName) {
      axios.post('http://localhost:3001/api/roles', { roleName })
        .then(() => {
          console.log('Группа успешно добавлена');
          fetchRoles();
        })
        .catch(error => {
          console.error('Ошибка при добавлении группы:', error);
        });
    }
  };

  const handleEditRole = (roleId) => {
    const newRoleName = prompt('Введите новое название группы:');
    if (newRoleName) {
      axios.put(`http://localhost:3001/api/roles/${roleId}`, { roleName: newRoleName })
        .then(() => {
          console.log('Группа успешно отредактирована');
          fetchRoles();
        })
        .catch(error => {
          console.error('Ошибка при редактировании группы:', error);
        });
    }
  };

  const handleDeleteRole = (roleId) => {
    if (window.confirm('Вы уверены, что хотите удалить эту группу?')) {
      axios.delete(`http://localhost:3001/api/roles/${roleId}`)
        .then(() => {
          console.log('Группа успешно удалена');
          fetchRoles();
        })
        .catch(error => {
          if (error.response && error.response.status === 400) {
            alert('Невозможно удалить роль, так как она используется пользователями.');
          } else {
            console.error('Ошибка при удалении группы:', error);
          }
        });
    }
  };

  const handleBackClick = () => {
    navigate('/admin'); // Переход на страницу Admin.js
  };

  return (
    <div className="edit-user-groups-container">
      <h2>Редактирование групп пользователей</h2>
      <button className="back-button" onClick={handleBackClick}>Вернуться назад</button>
      <table className="edit-user-groups-table">
        <thead>
          <tr>
            <th>ID роли</th>
            <th>Название роли</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.roleId}>
              <td>{role.roleId}</td>
              <td>{role.roleName}</td>
              <td>
                <button className="edit-user-groups-button" onClick={() => handleEditRole(role.roleId)}>Редактировать</button>
                <button className="edit-user-groups-button" onClick={() => handleDeleteRole(role.roleId)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="add-role-button" onClick={handleAddRole}>Добавить группу</button>
    </div>
  );
};

export default EditUserGroups;