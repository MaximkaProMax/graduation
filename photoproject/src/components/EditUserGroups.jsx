import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditUserGroups.css';
import { useNavigate } from 'react-router-dom';

const EditUserGroups = () => {
  const [roles, setRoles] = useState([]);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [editingRoleName, setEditingRoleName] = useState('');
  const [newRoleName, setNewRoleName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/roles');
      setRoles(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке ролей:', error);
    }
  };

  const handleAddRole = async (e) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    try {
      await axios.post('http://localhost:3001/api/roles', { roleName: newRoleName });
      setNewRoleName('');
      fetchRoles();
    } catch (error) {
      console.error('Ошибка при добавлении группы:', error);
    }
  };

  const handleEditRole = (roleId, roleName) => {
    setEditingRoleId(roleId);
    setEditingRoleName(roleName);
  };

  const handleRoleNameChange = (e) => {
    setEditingRoleName(e.target.value);
  };

  const handleSaveRole = async (roleId) => {
    try {
      await axios.put(`http://localhost:3001/api/roles/${roleId}`, { roleName: editingRoleName });
      setRoles(roles.map(role =>
        role.roleId === roleId ? { ...role, roleName: editingRoleName } : role
      ));
      setEditingRoleId(null);
      setEditingRoleName('');
    } catch (error) {
      console.error('Ошибка при сохранении роли:', error);
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (window.confirm('Вы уверены, что хотите удалить эту группу?')) {
      try {
        await axios.delete(`http://localhost:3001/api/roles/${roleId}`);
        setRoles(roles.filter(role => role.roleId !== roleId));
      } catch (error) {
        if (error.response && error.response.status === 400) {
          alert('Невозможно удалить роль, так как она используется пользователями.');
        } else {
          console.error('Ошибка при удалении группы:', error);
        }
      }
    }
  };

  const handleBackClick = () => {
    navigate('/admin');
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
              <td>
                {editingRoleId === role.roleId ? (
                  <input
                    type="text"
                    value={editingRoleName}
                    onChange={handleRoleNameChange}
                    autoFocus
                  />
                ) : (
                  role.roleName
                )}
              </td>
              <td>
                {editingRoleId === role.roleId ? (
                  <>
                    <button
                      className="edit-user-groups-button edit"
                      onClick={() => handleSaveRole(role.roleId)}
                    >
                      Сохранить
                    </button>
                    <button
                      className="edit-user-groups-button"
                      onClick={() => {
                        setEditingRoleId(null);
                        setEditingRoleName('');
                      }}
                    >
                      Отмена
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="edit-user-groups-button edit"
                      onClick={() => handleEditRole(role.roleId, role.roleName)}
                    >
                      Редактировать
                    </button>
                    <button
                      className="edit-user-groups-button delete"
                      onClick={() => handleDeleteRole(role.roleId)}
                    >
                      Удалить
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <form
        onSubmit={handleAddRole}
        style={{ marginBottom: 20 }}
      >
        <input
          type="text"
          value={newRoleName}
          onChange={e => setNewRoleName(e.target.value)}
          placeholder="Введите название новой группы"
          style={{
            width: '100%',
            padding: 8,
            borderRadius: 5,
            border: '1px solid #ddd',
            marginBottom: 8
          }}
        />
        <button type="submit" className="add-role-button" style={{ width: '100%' }}>
          Добавить группу
        </button>
      </form>
    </div>
  );
};

export default EditUserGroups;