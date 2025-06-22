import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/EditUserGroups.css';
import { useNavigate } from 'react-router-dom';
import { checkPageAccess } from '../../utils/checkPageAccess';
import Modal from 'react-modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditUserGroups = () => {
  const [roles, setRoles] = useState([]);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [editingRoleName, setEditingRoleName] = useState('');
  const [newRoleName, setNewRoleName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const navigate = useNavigate();

  const fetchRoles = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/roles');
      setRoles(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке ролей:', error);
    }
  };

  useEffect(() => {
    checkPageAccess('EditUserGroups', navigate, setIsAuthorized, setIsLoading);
  }, [navigate]);

  useEffect(() => {
    if (isAuthorized) {
      fetchRoles();
    }
  }, [isAuthorized]);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!isAuthorized) {
    return null; // Не отображаем ничего, если пользователь не авторизован
  }

  const handleAddRole = async (e) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    try {
      await axios.post('http://localhost:3001/api/roles', { roleName: newRoleName });
      setNewRoleName('');
      setShowAddForm(false);
      fetchRoles();
      toast.success('Группа успешно добавлена!');
    } catch (error) {
      console.error('Ошибка при добавлении группы:', error);
      toast.error('Ошибка при добавлении группы');
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

  const openDeleteModal = (id) => setDeleteModal({ open: true, id });
  const closeDeleteModal = () => setDeleteModal({ open: false, id: null });

  const confirmDelete = async () => {
    if (!deleteModal.id) return closeDeleteModal();
    try {
      await axios.delete(`http://localhost:3001/api/roles/${deleteModal.id}`);
      setRoles(roles.filter(role => role.roleId !== deleteModal.id));
      toast.success('Группа успешно удалена!');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert('Невозможно удалить роль, так как она используется пользователями.');
      } else {
        console.error('Ошибка при удалении группы:', error);
        toast.error('Ошибка при удалении группы');
      }
    } finally {
      closeDeleteModal();
    }
  };

  const handleBackClick = () => {
    navigate('/admin');
  };

  return (
    <div className="edit-user-groups-container">
      <ToastContainer position="top-center" autoClose={3000} />
      {/* Модальное окно подтверждения удаления */}
      <Modal
        isOpen={deleteModal.open}
        onRequestClose={closeDeleteModal}
        className="modal"
        overlayClassName="overlay"
        ariaHideApp={false}
      >
        <h2>Подтвердите удаление</h2>
        <p>Вы уверены, что хотите удалить эту группу?</p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 24 }}>
          <button className="submit-button" style={{ minWidth: 120 }} onClick={confirmDelete}>Удалить</button>
          <button className="submit-button" style={{ minWidth: 120, background: '#ccc', color: '#222' }} onClick={closeDeleteModal}>Отмена</button>
        </div>
      </Modal>
      <h2>Редактирование групп пользователей</h2>
      <button className="back-button" onClick={handleBackClick}>Вернуться назад</button>
      {/* Добавляем фон-карточку для таблицы */}
      <div className="requests-orders-card">
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
                <td className="actions-cell">
                  <div className="edit-user-groups-actions">
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
                          onClick={() => openDeleteModal(role.roleId)}
                        >
                          Удалить
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showAddForm ? (
        <div className="add-role-form" style={{ marginBottom: 20 }}>
          <h3>Добавить группу</h3>
          <div className="input-group">
            <label>Название группы</label>
            <input
              type="text"
              value={newRoleName}
              onChange={e => setNewRoleName(e.target.value)}
              placeholder="Введите название новой группы"
            />
          </div>
          <button className="edit-user-groups-button edit" onClick={handleAddRole}>Сохранить</button>
          <button className="edit-user-groups-button" onClick={() => { setShowAddForm(false); setNewRoleName(''); }}>Отмена</button>
        </div>
      ) : (
        <button className="add-role-button" style={{ width: '100%' }} onClick={() => setShowAddForm(true)}>
          Добавить группу
        </button>
      )}
    </div>
  );
};

export default EditUserGroups;