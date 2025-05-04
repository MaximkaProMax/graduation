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
  const [showAddStudioForm, setShowAddStudioForm] = useState(false);
  const [showAddTypographyForm, setShowAddTypographyForm] = useState(false);
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
    const { id, ...updateData } = editableStudio;

    if (Object.values(updateData).every(value => value)) {
      if (id) {
        axios.put(`http://localhost:3001/api/photostudios/${id}`, updateData)
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

  const handleSaveNewStudio = () => {
    const { studio, address, opening_hours, price } = editableStudio;
    if (!studio || !address || !opening_hours || !price) {
      alert('Все поля должны быть заполнены');
      return;
    }
    axios.post('http://localhost:3001/api/photostudios', {
      studio,
      address,
      opening_hours,
      price
    })
      .then(() => {
        fetchStudios();
        setShowAddStudioForm(false);
        setEditableStudio({});
      })
      .catch(error => {
        console.error('Ошибка при добавлении фотостудии:', error);
      });
  };

  const handleSaveTypography = () => {
    const { typographyId, ...updateData } = editableTypography;

    // Преобразуем format и lamination в массивы, если это строки
    if (updateData.format && !Array.isArray(updateData.format)) {
      updateData.format = updateData.format.split(',').map(f => f.trim());
    }
    if (updateData.lamination && !Array.isArray(updateData.lamination)) {
      updateData.lamination = updateData.lamination.split('/').map(l => l.trim());
    }

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

  const handleSaveNewTypography = () => {
    let { format, the_basis_of_the_spread, number_of_spreads, lamination, number_of_copies, address_delivery, final_price, album_name } = editableTypography;
    if (!format || !number_of_spreads || !lamination || !number_of_copies || !final_price || !album_name) {
      alert('Все поля должны быть заполнены');
      return;
    }

    // Преобразуем format и lamination в массивы, если пользователь ввёл строку с разделителями
    if (typeof format === 'string') {
      format = format.includes(',') ? format.split(',').map(f => f.trim()) : [format.trim()];
    }
    if (typeof lamination === 'string') {
      lamination = lamination.includes('/') ? lamination.split('/').map(l => l.trim()) : [lamination.trim()];
    }

    axios.post('http://localhost:3001/api/printing', {
      format,
      the_basis_of_the_spread: the_basis_of_the_spread || 'Не указано',
      number_of_spreads,
      lamination,
      number_of_copies,
      address_delivery: address_delivery || 'Не указано',
      final_price,
      album_name,
      main_card_photo: 'default_photo.jpg', // Укажите значение по умолчанию
      main_album_name: album_name, // Используем название альбома
      main_card_description: 'Описание отсутствует' // Укажите значение по умолчанию
    })
      .then(() => {
        fetchTypographies();
        setShowAddTypographyForm(false);
        setEditableTypography({});
      })
      .catch(error => {
        console.error('Ошибка при добавлении типографии:', error);
      });
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
    setEditableStudio({
      studio: '',
      address: '',
      opening_hours: '',
      price: ''
    });
    setShowAddStudioForm(true);
    setIsEditingStudio(false);
  };

  const handleAddTypography = () => {
    setEditableTypography({
      format: '',
      the_basis_of_the_spread: '',
      number_of_spreads: '',
      lamination: '',
      number_of_copies: '',
      address_delivery: '',
      final_price: '',
      album_name: ''
    });
    setShowAddTypographyForm(true);
    setIsEditingTypography(false);
  };

  const handleBackClick = () => {
    navigate('/admin'); // Переход на страницу Admin.js
  };

  return (
    <div className="edit-database-container">
      <h2>Редактирование базы данных</h2>
      <button className="back-button" onClick={handleBackClick}>Вернуться назад</button>

      <h3>Фотостудии</h3>
      <div className="edit-database-table-container" style={{ overflowX: 'auto', width: '100%' }}>
        <table className="edit-database-table" style={{ minWidth: 1200 }}>
          <thead>
            <tr>
              {studios.length > 0 &&
                Object.keys(studios[0])
                  .filter(
                    key =>
                      ![
                        'contact_information',
                        'description',
                        'booking',
                        'photo',
                        'date_of_creation',
                        'date_of_editing'
                      ].includes(key)
                  )
                  .map((key) => (
                    <th key={key}>{key}</th>
                  ))}
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {studios.map((studio) => (
              <tr key={studio.id}>
                {Object.keys(studio)
                  .filter(
                    key =>
                      ![
                        'contact_information',
                        'description',
                        'booking',
                        'photo',
                        'date_of_creation',
                        'date_of_editing'
                      ].includes(key)
                  )
                  .map((key) => (
                    <td key={`${studio.id}-${key}`}>
                      {isEditingStudio && editableStudio.id === studio.id ? (
                        <input
                          type="text"
                          name={key}
                          value={editableStudio[key] || ''}
                          onChange={(e) => handleInputChange(e, setEditableStudio)}
                          style={{ minWidth: 120 }}
                        />
                      ) : (
                        studio[key]
                      )}
                    </td>
                  ))}
                <td key={`${studio.id}-actions`}>
                  {isEditingStudio && editableStudio.id === studio.id ? (
                    <>
                      <button className="edit-database-button" onClick={handleSaveStudio}>Сохранить</button>
                      <button className="edit-database-button" onClick={handleCancelEdit}>Отмена</button>
                    </>
                  ) : (
                    <>
                      <button className="edit-database-button" onClick={() => handleEditStudio(studio)}>Редактировать</button>
                      <button className="edit-database-button delete" onClick={() => handleDeleteStudio(studio.id)}>Удалить</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!showAddStudioForm && (
        <button className="add-studio-button" onClick={handleAddStudio}>Добавить фотостудию</button>
      )}
      {showAddStudioForm && (
        <form
          style={{
            background: '#fafafa',
            border: '1px solid #ececec',
            borderRadius: 8,
            padding: 22,
            margin: '20px 0',
            maxWidth: 500
          }}
          onSubmit={e => { e.preventDefault(); handleSaveNewStudio(); }}
        >
          <h4 style={{ marginTop: 0 }}>Добавление фотостудии</h4>
          <div style={{ marginBottom: 10 }}>
            <label>Название студии</label>
            <input
              type="text"
              name="studio"
              value={editableStudio.studio || ''}
              onChange={e => handleInputChange(e, setEditableStudio)}
              style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
              required
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>Адрес</label>
            <input
              type="text"
              name="address"
              value={editableStudio.address || ''}
              onChange={e => handleInputChange(e, setEditableStudio)}
              style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
              required
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>Время работы</label>
            <input
              type="text"
              name="opening_hours"
              value={editableStudio.opening_hours || ''}
              onChange={e => handleInputChange(e, setEditableStudio)}
              style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
              required
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>Цена</label>
            <input
              type="text"
              name="price"
              value={editableStudio.price || ''}
              onChange={e => handleInputChange(e, setEditableStudio)}
              style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
              required
            />
          </div>
          <button className="edit-database-button" type="submit">Сохранить</button>
          <button
            className="edit-database-button"
            type="button"
            style={{ marginLeft: 8 }}
            onClick={() => { setShowAddStudioForm(false); setEditableStudio({}); }}
          >
            Отмена
          </button>
        </form>
      )}

      <h3>Типографии</h3>
      <div className="edit-database-table-container" style={{ overflowX: 'auto', width: '100%' }}>
        <table className="edit-database-table" style={{ minWidth: 1400 }}>
          <thead>
            <tr>
              {typographies.length > 0 &&
                Object.keys(typographies[0])
                  .filter(
                    key =>
                      ![
                        'main_card_photo',
                        'name_on_page',
                        'photos_on_page',
                        'additional_information',
                        'date_of_creation',
                        'date_of_editing'
                      ].includes(key)
                  )
                  .map((key) => (
                    <th key={key}>{key}</th>
                  ))}
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {typographies.map((typography) => (
              <tr key={typography.typographyId}>
                {Object.keys(typography)
                  .filter(
                    key =>
                      ![
                        'main_card_photo',
                        'name_on_page',
                        'photos_on_page',
                        'additional_information',
                        'date_of_creation',
                        'date_of_editing'
                      ].includes(key)
                  )
                  .map((key) => (
                    <td key={`${typography.typographyId}-${key}`}>
                      {isEditingTypography && editableTypography.typographyId === typography.typographyId ? (
                        key === 'format' && Array.isArray(editableTypography[key]) ? (
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {editableTypography[key].map((f, idx) => (
                              <input
                                key={idx}
                                type="text"
                                value={f}
                                style={{ marginBottom: 2 }}
                                onChange={e => {
                                  const newArr = [...editableTypography[key]];
                                  newArr[idx] = e.target.value;
                                  setEditableTypography(prev => ({
                                    ...prev,
                                    [key]: newArr
                                  }));
                                }}
                              />
                            ))}
                          </div>
                        ) : (
                          <input
                            type="text"
                            name={key}
                            value={editableTypography[key] || ''}
                            onChange={(e) => handleInputChange(e, setEditableTypography)}
                            style={{ minWidth: 120 }}
                          />
                        )
                      ) : (
                        key === 'format' && Array.isArray(typography[key]) ? (
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {typography[key].map((f, idx) => (
                              <span key={idx}>{f}</span>
                            ))}
                          </div>
                        ) : (
                          typography[key]
                        )
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
                      <button className="edit-database-button delete" onClick={() => handleDeleteTypography(typography.typographyId)}>Удалить</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!showAddTypographyForm && (
        <button className="add-typography-button" onClick={handleAddTypography}>Добавить типографию</button>
      )}
      {showAddTypographyForm && (
        <>
          <div style={{ margin: '10px 0', color: '#888', fontSize: 14 }}>
            <b>Примечание:</b> Перед отправкой на сервер, если пользователь ввёл строку с разделителями (например, "123, 456"), преобразуйте её в массив по этим разделителям.<br />
            Для поля <b>format</b> используйте разделитель запятая.<br />
            Для поля <b>lamination</b> используйте разделитель слэш.<br />
            <span style={{ color: '#666' }}>
              <b>Пример:</b> <br />
              Формат: <code>30, 40, 50</code><br />
              Ламинация: <code>глянцевая/матовая</code>
            </span>
          </div>
          <form
            style={{
              background: '#fafafa',
              border: '1px solid #ececec',
              borderRadius: 8,
              padding: 22,
              margin: '20px 0',
              maxWidth: 500
            }}
            onSubmit={e => { e.preventDefault(); handleSaveNewTypography(); }}
          >
            <h4 style={{ marginTop: 0 }}>Добавление типографии</h4>
            <div style={{ marginBottom: 10 }}>
              <label>Формат</label>
              <input
                type="text"
                name="format"
                value={editableTypography.format || ''}
                onChange={e => handleInputChange(e, setEditableTypography)}
                style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
                required
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Основа разворота</label>
              <input
                type="text"
                name="the_basis_of_the_spread"
                value={editableTypography.the_basis_of_the_spread || ''}
                onChange={e => handleInputChange(e, setEditableTypography)}
                style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Количество разворотов</label>
              <input
                type="number"
                name="number_of_spreads"
                value={editableTypography.number_of_spreads || ''}
                onChange={e => handleInputChange(e, setEditableTypography)}
                style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
                required
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Ламинация</label>
              <input
                type="text"
                name="lamination"
                value={editableTypography.lamination || ''}
                onChange={e => handleInputChange(e, setEditableTypography)}
                style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
                required
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Количество копий</label>
              <input
                type="number"
                name="number_of_copies"
                value={editableTypography.number_of_copies || ''}
                onChange={e => handleInputChange(e, setEditableTypography)}
                style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
                required
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Адрес доставки</label>
              <input
                type="text"
                name="address_delivery"
                value={editableTypography.address_delivery || ''}
                onChange={e => handleInputChange(e, setEditableTypography)}
                style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Итоговая цена</label>
              <input
                type="number"
                name="final_price"
                value={editableTypography.final_price || ''}
                onChange={e => handleInputChange(e, setEditableTypography)}
                style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
                required
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Название альбома</label>
              <input
                type="text"
                name="album_name"
                value={editableTypography.album_name || ''}
                onChange={e => handleInputChange(e, setEditableTypography)}
                style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
                required
              />
            </div>
            <button className="edit-database-button" type="submit">Сохранить</button>
            <button
              className="edit-database-button"
              type="button"
              style={{ marginLeft: 8 }}
              onClick={() => { setShowAddTypographyForm(false); setEditableTypography({}); }}
            >
              Отмена
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default EditDatabase;