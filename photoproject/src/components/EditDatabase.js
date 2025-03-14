import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditDatabase.css';
import { useNavigate } from 'react-router-dom';

const EditDatabase = () => {
  const [studios, setStudios] = useState([]);
  const [typographies, setTypographies] = useState([]);
  const [editableStudio, setEditableStudio] = useState({});
  const [editableTypography, setEditableTypography] = useState({});
  const [isEditingStudio, setIsEditingStudio] = useState(false);
  const [isEditingTypography, setIsEditingTypography] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudios();
    fetchTypographies();
  }, []);

  const fetchStudios = () => {
    console.log('Загрузка данных о фотостудиях...');
    axios.get('http://localhost:3001/api/photostudios')
      .then(response => {
        if (Array.isArray(response.data)) {
          setStudios(response.data);
          console.log('Данные о фотостудиях загружены:', response.data);
        }
      })
      .catch(error => {
        console.error('Ошибка при получении данных о фотостудиях:', error);
      });
  };

  const fetchTypographies = () => {
    console.log('Загрузка данных о типографиях...');
    axios.get('http://localhost:3001/api/printing')
      .then(response => {
        if (Array.isArray(response.data)) {
          setTypographies(response.data);
          console.log('Данные о типографиях загружены:', response.data);
        }
      })
      .catch(error => {
        console.error('Ошибка при получении данных о типографиях:', error);
      });
  };

  const handleInputChange = (e, setEditable) => {
    const { name, value } = e.target;
    setEditable(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSaveStudio = () => {
    const { studioId, ...updateData } = editableStudio;

    if (Object.values(updateData).every(value => value)) {
      if (studioId) {
        axios.put(`http://localhost:3001/api/photostudios/${studioId}`, updateData)
          .then(() => {
            fetchStudios();
            setIsEditingStudio(false);
            setEditableStudio({});
          })
          .catch(error => {
            console.error('Ошибка при обновлении данных фотостудии:', error);
          });
      } else {
        axios.post('http://localhost:3001/api/photostudios', updateData)
          .then(() => {
            fetchStudios();
            setIsEditingStudio(false);
            setEditableStudio({});
          })
          .catch(error => {
            console.error('Ошибка при добавлении фотостудии:', error);
          });
      }
    }
  };

  const handleSaveTypography = () => {
    const { typographyId, ...updateData } = editableTypography;

    if (Object.values(updateData).every(value => value)) {
      if (typographyId) {
        axios.put(`http://localhost:3001/api/printing/${typographyId}`, updateData)
          .then(() => {
            fetchTypographies();
            setIsEditingTypography(false);
            setEditableTypography({});
          })
          .catch(error => {
            console.error('Ошибка при обновлении данных типографии:', error);
          });
      } else {
        axios.post('http://localhost:3001/api/printing', updateData)
          .then(() => {
            fetchTypographies();
            setIsEditingTypography(false);
            setEditableTypography({});
          })
          .catch(error => {
            console.error('Ошибка при добавлении типографии:', error);
          });
      }
    }
  };

  const handleEditStudio = (studio) => {
    setEditableStudio(studio);
    setIsEditingStudio(true);
  };

  const handleEditTypography = (typography) => {
    setEditableTypography(typography);
    setIsEditingTypography(true);
  };

  const handleCancelEdit = () => {
    setIsEditingStudio(false);
    setIsEditingTypography(false);
    setEditableStudio({});
    setEditableTypography({});
  };

  const handleDeleteStudio = (studioId) => {
    if (window.confirm('Вы уверены, что хотите удалить эту фотостудию?')) {
      axios.delete(`http://localhost:3001/api/photostudios/${studioId}`)
        .then(() => {
          fetchStudios();
        })
        .catch(error => {
          console.error('Ошибка при удалении фотостудии:', error);
        });
    }
  };

  const handleDeleteTypography = (typographyId) => {
    if (window.confirm('Вы уверены, что хотите удалить эту типографию?')) {
      axios.delete(`http://localhost:3001/api/printing/${typographyId}`)
        .then(() => {
          fetchTypographies();
        })
        .catch(error => {
          console.error('Ошибка при удалении типографии:', error);
        });
    }
  };

  const handleAddStudio = () => {
    setEditableStudio({});
    setIsEditingStudio(true);
  };

  const handleAddTypography = () => {
    setEditableTypography({});
    setIsEditingTypography(true);
  };

  const handleBackClick = () => {
    navigate('/admin'); // Переход на страницу Admin.js
  };

  return (
    <div className="edit-database-container">
      <h2>Редактирование базы данных</h2>
      <button className="back-button" onClick={handleBackClick}>Вернуться назад</button>

      <h3>Фотостудии</h3>
      <div className="edit-database-table-container">
        <table className="edit-database-table">
          <thead>
            <tr>
              {studios.length > 0 && Object.keys(studios[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {studios.map((studio) => (
              <tr key={studio.studioId}>
                {Object.keys(studio).map((key) => (
                  <td key={`${studio.studioId}-${key}`}>
                    {isEditingStudio && editableStudio.studioId === studio.studioId ? (
                      <input
                        type="text"
                        name={key}
                        value={editableStudio[key] || ''}
                        onChange={(e) => handleInputChange(e, setEditableStudio)}
                      />
                    ) : (
                      studio[key]
                    )}
                  </td>
                ))}
                <td key={`${studio.studioId}-actions`}>
                  {isEditingStudio && editableStudio.studioId === studio.studioId ? (
                    <>
                      <button className="edit-database-button" onClick={handleSaveStudio}>Сохранить</button>
                      <button className="edit-database-button" onClick={handleCancelEdit}>Отмена</button>
                    </>
                  ) : (
                    <>
                      <button className="edit-database-button" onClick={() => handleEditStudio(studio)}>Редактировать</button>
                      <button className="edit-database-button" onClick={() => handleDeleteStudio(studio.studioId)}>Удалить</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="add-studio-button" onClick={handleAddStudio}>Добавить фотостудию</button>

      <h3>Типографии</h3>
      <div className="edit-database-table-container">
        <table className="edit-database-table">
          <thead>
            <tr>
              {typographies.length > 0 && Object.keys(typographies[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {typographies.map((typography) => (
              <tr key={typography.typographyId}>
                {Object.keys(typography).map((key) => (
                  <td key={`${typography.typographyId}-${key}`}>
                    {isEditingTypography && editableTypography.typographyId === typography.typographyId ? (
                      <input
                        type="text"
                        name={key}
                        value={editableTypography[key] || ''}
                        onChange={(e) => handleInputChange(e, setEditableTypography)}
                      />
                    ) : (
                      typography[key]
                    )}
                  </td>
                ))}
                <td key={`${typography.typographyId}-actions`}>
                  {isEditingTypography && editableTypography.typographyId === typography.typographyId ? (
                    <>
                      <button className="edit-database-button" onClick={handleSaveTypography}>Сохранить</button>
                      <button className="edit-database-button" onClick={handleCancelEdit}>Отмена</button>
                    </>
                  ) : (
                    <>
                      <button className="edit-database-button" onClick={() => handleEditTypography(typography)}>Редактировать</button>
                      <button className="edit-database-button" onClick={() => handleDeleteTypography(typography.typographyId)}>Удалить</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="add-typography-button" onClick={handleAddTypography}>Добавить типографию</button>
    </div>
  );
};

export default EditDatabase;