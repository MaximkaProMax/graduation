import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditDatabase.css';
import { useNavigate } from 'react-router-dom';

const EditDatabase = () => {
  const [studios, setStudios] = useState([]);
  const [typographies, setTypographies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudios();
    fetchTypographies();
  }, []);

  const fetchStudios = () => {
    axios.get('http://localhost:3001/api/studios')
      .then(response => {
        if (Array.isArray(response.data)) {
          setStudios(response.data);
        }
      })
      .catch(error => {
        console.error('Ошибка при получении данных о фотостудиях:', error);
      });
  };

  const fetchTypographies = () => {
    axios.get('http://localhost:3001/api/typographies')
      .then(response => {
        if (Array.isArray(response.data)) {
          setTypographies(response.data);
        }
      })
      .catch(error => {
        console.error('Ошибка при получении данных о типографиях:', error);
      });
  };

  const handleAddStudio = () => {
    const studioName = prompt('Введите название новой фотостудии:');
    const studioAddress = prompt('Введите адрес новой фотостудии:');
    const studioHours = prompt('Введите часы работы новой фотостудии:');
    const studioPrice = prompt('Введите цену новой фотостудии:');
    const studioContact = prompt('Введите контактную информацию новой фотостудии:');
    const studioDescription = prompt('Введите описание новой фотостудии:');

    if (studioName && studioAddress && studioHours && studioPrice && studioContact && studioDescription) {
      axios.post('http://localhost:3001/api/studios', {
        name: studioName,
        address: studioAddress,
        hours: studioHours,
        price: studioPrice,
        contact: studioContact,
        description: studioDescription,
      })
        .then(() => {
          console.log('Фотостудия успешно добавлена');
          fetchStudios();
        })
        .catch(error => {
          console.error('Ошибка при добавлении фотостудии:', error);
        });
    }
  };

  const handleEditStudio = (studioId) => {
    const studioName = prompt('Введите новое название фотостудии:');
    const studioAddress = prompt('Введите новый адрес фотостудии:');
    const studioHours = prompt('Введите новые часы работы фотостудии:');
    const studioPrice = prompt('Введите новую цену фотостудии:');
    const studioContact = prompt('Введите новую контактную информацию фотостудии:');
    const studioDescription = prompt('Введите новое описание фотостудии:');

    if (studioName && studioAddress && studioHours && studioPrice && studioContact && studioDescription) {
      axios.put(`http://localhost:3001/api/studios/${studioId}`, {
        name: studioName,
        address: studioAddress,
        hours: studioHours,
        price: studioPrice,
        contact: studioContact,
        description: studioDescription,
      })
        .then(() => {
          console.log('Фотостудия успешно отредактирована');
          fetchStudios();
        })
        .catch(error => {
          console.error('Ошибка при редактировании фотостудии:', error);
        });
    }
  };

  const handleDeleteStudio = (studioId) => {
    if (window.confirm('Вы уверены, что хотите удалить эту фотостудию?')) {
      axios.delete(`http://localhost:3001/api/studios/${studioId}`)
        .then(() => {
          console.log('Фотостудия успешно удалена');
          fetchStudios();
        })
        .catch(error => {
          console.error('Ошибка при удалении фотостудии:', error);
        });
    }
  };

  const handleAddTypography = () => {
    const typographyName = prompt('Введите название новой типографии:');
    const typographyFormats = prompt('Введите форматы новой типографии:');
    const typographyBase = prompt('Введите основу разворота новой типографии:');
    const typographyPages = prompt('Введите количество разворотов новой типографии:');
    const typographyLamination = prompt('Введите ламинацию новой типографии:');
    const typographyCopies = prompt('Введите количество экземпляров новой типографии:');
    const typographyPrice = prompt('Введите цену новой типографии:');
    const typographyContact = prompt('Введите контактную информацию новой типографии:');
    const typographyDescription = prompt('Введите описание новой типографии:');

    if (typographyName && typographyFormats && typographyBase && typographyPages && typographyLamination && typographyCopies && typographyPrice && typographyContact && typographyDescription) {
      axios.post('http://localhost:3001/api/typographies', {
        name: typographyName,
        formats: typographyFormats,
        base: typographyBase,
        pages: typographyPages,
        lamination: typographyLamination,
        copies: typographyCopies,
        price: typographyPrice,
        contact: typographyContact,
        description: typographyDescription,
      })
        .then(() => {
          console.log('Типография успешно добавлена');
          fetchTypographies();
        })
        .catch(error => {
          console.error('Ошибка при добавлении типографии:', error);
        });
    }
  };

  const handleEditTypography = (typographyId) => {
    const typographyName = prompt('Введите новое название типографии:');
    const typographyFormats = prompt('Введите новые форматы типографии:');
    const typographyBase = prompt('Введите новую основу разворота типографии:');
    const typographyPages = prompt('Введите новое количество разворотов типографии:');
    const typographyLamination = prompt('Введите новую ламинацию типографии:');
    const typographyCopies = prompt('Введите новое количество экземпляров типографии:');
    const typographyPrice = prompt('Введите новую цену типографии:');
    const typographyContact = prompt('Введите новую контактную информацию типографии:');
    const typographyDescription = prompt('Введите новое описание типографии:');

    if (typographyName && typographyFormats && typographyBase && typographyPages && typographyLamination && typographyCopies && typographyPrice && typographyContact && typographyDescription) {
      axios.put(`http://localhost:3001/api/typographies/${typographyId}`, {
        name: typographyName,
        formats: typographyFormats,
        base: typographyBase,
        pages: typographyPages,
        lamination: typographyLamination,
        copies: typographyCopies,
        price: typographyPrice,
        contact: typographyContact,
        description: typographyDescription,
      })
        .then(() => {
          console.log('Типография успешно отредактирована');
          fetchTypographies();
        })
        .catch(error => {
          console.error('Ошибка при редактировании типографии:', error);
        });
    }
  };

  const handleDeleteTypography = (typographyId) => {
    if (window.confirm('Вы уверены, что хотите удалить эту типографию?')) {
      axios.delete(`http://localhost:3001/api/typographies/${typographyId}`)
        .then(() => {
          console.log('Типография успешно удалена');
          fetchTypographies();
        })
        .catch(error => {
          console.error('Ошибка при удалении типографии:', error);
        });
    }
  };

  const handleBackClick = () => {
    navigate('/admin'); // Переход на страницу Admin.js
  };

  return (
    <div className="edit-database-container">
      <h2>Редактирование базы данных</h2>
      <button className="back-button" onClick={handleBackClick}>Вернуться назад</button>

      <h3>Фотостудии</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Адрес</th>
            <th>Часы работы</th>
            <th>Цена</th>
            <th>Контактная информация</th>
            <th>Описание</th>
            <th>Дата создания</th>
            <th>Дата редактирования</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {studios.map((studio) => (
            <tr key={studio.studioId}>
              <td>{studio.studioId}</td>
              <td>{studio.name}</td>
              <td>{studio.address}</td>
              <td>{studio.hours}</td>
              <td>{studio.price}</td>
              <td>{studio.contact}</td>
              <td>{studio.description}</td>
              <td>{new Date(studio.createdAt).toLocaleDateString()}</td>
              <td>{new Date(studio.updatedAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleEditStudio(studio.studioId)}>Редактировать</button>
                <button onClick={() => handleDeleteStudio(studio.studioId)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="add-studio-button" onClick={handleAddStudio}>Добавить фотостудию</button>

      <h3>Типографии</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Форматы</th>
            <th>Основа разворота</th>
            <th>Количество разворотов</th>
            <th>Ламинация</th>
            <th>Количество экземпляров</th>
            <th>Цена</th>
            <th>Контактная информация</th>
            <th>Описание</th>
            <th>Дата создания</th>
            <th>Дата редактирования</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {typographies.map((typography) => (
            <tr key={typography.typographyId}>
              <td>{typography.typographyId}</td>
              <td>{typography.name}</td>
              <td>{typography.formats}</td>
              <td>{typography.base}</td>
              <td>{typography.pages}</td>
              <td>{typography.lamination}</td>
              <td>{typography.copies}</td>
              <td>{typography.price}</td>
              <td>{typography.contact}</td>
              <td>{typography.description}</td>
              <td>{new Date(typography.createdAt).toLocaleDateString()}</td>
              <td>{new Date(typography.updatedAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleEditTypography(typography.typographyId)}>Редактировать</button>
                <button onClick={() => handleDeleteTypography(typography.typographyId)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="add-typography-button" onClick={handleAddTypography}>Добавить типографию</button>
    </div>
  );
};

export default EditDatabase;