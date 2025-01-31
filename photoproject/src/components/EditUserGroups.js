import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditUserGroups.css';

const EditUserGroups = () => {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    // Получение данных о ролях
    axios.get('http://localhost:3001/api/roles')
      .then(response => {
        console.log('Данные о ролях, полученные с сервера:', response); // Отладочный вывод полного ответа
        console.log('Тип данных, полученных с сервера:', typeof response.data); // Отладочный вывод типа данных
        console.log('Конкретные данные:', response.data); // Отладочный вывод конкретных данных
        // Проверяем, что данные являются массивом
        if (Array.isArray(response.data)) {
          console.log('Преобразованные данные в состояние:', response.data); // Дополнительный отладочный вывод
          setRoles(response.data);
        } else if (typeof response.data === 'object') {
          console.log('Преобразуем объект в массив:', [response.data]); // Отладочный вывод
          setRoles([response.data]);
        } else {
          console.error('Полученные данные не являются массивом или объектом:', response.data);
        }
      })
      .catch(error => {
        console.error('Ошибка при получении данных о ролях:', error);
      });
  }, []);

  return (
    <div className="edit-user-groups-container">
      <h2>Редактирование групп пользователей</h2>
      <table>
        <thead>
          <tr>
            <th>ID роли</th>
            <th>Название роли</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(roles) && roles.map((role) => (
            <tr key={role.roleId}>
              <td>{role.roleId}</td>
              <td>{role.roleName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EditUserGroups;