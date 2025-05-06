import React, { useState, useEffect, useRef } from 'react';
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
  const [savingStudio, setSavingStudio] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [editingPhotoStudioId, setEditingPhotoStudioId] = useState(null);
  const fileInputRef = useRef(null);
  const editingPhotoInputRef = useRef(null);
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
    const { id, studio, address, opening_hours, price, photo } = editableStudio;
    if (!studio || !address || !opening_hours || !price) {
      alert('Все поля должны быть заполнены');
      return;
    }
    setSavingStudio(true);
    if (id) {
      axios.put(`http://localhost:3001/api/photostudios/${id}`, {
        studio,
        address,
        opening_hours,
        price,
        photo
      })
        .then(() => {
          fetchStudios();
          setIsEditingStudio(false);
          setEditableStudio({});
        })
        .catch(error => {
          console.error('Ошибка при обновлении данных фотостудии:', error);
        })
        .finally(() => setSavingStudio(false));
    } else {
      axios.post('http://localhost:3001/api/photostudios', {
        studio,
        address,
        opening_hours,
        price,
        photo
      })
        .then(() => {
          fetchStudios();
          setIsEditingStudio(false);
          setEditableStudio({});
        })
        .catch(error => {
          console.error('Ошибка при добавлении фотостудии:', error);
        })
        .finally(() => setSavingStudio(false));
    }
  };

  const handleSaveNewStudio = () => {
    const { studio, address, opening_hours, price, photo } = editableStudio;
    if (!studio || !address || !opening_hours || !price) {
      alert('Все поля должны быть заполнены');
      return;
    }
    // ВАЖНО: photo может быть undefined, если пользователь не загрузил фото
    axios.post('http://localhost:3001/api/photostudios', {
      studio,
      address,
      opening_hours,
      price,
      photo: photo || '' // всегда отправляем поле photo
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
    const {
      main_card_photo,
      main_album_name,
      main_card_description,
      name_on_page,
      photos_on_page,
      product_description,
      additional_information,
      format,
      basis_for_spread,
      price_of_spread,
      lamination,
      copy_price,
      address_delivery,
      final_price,
      album_name
    } = editableTypography;

    if (
      !main_card_photo ||
      !main_album_name ||
      !main_card_description ||
      !name_on_page ||
      !photos_on_page ||
      !product_description ||
      !additional_information ||
      !format ||
      !basis_for_spread ||
      !price_of_spread ||
      !lamination ||
      !copy_price ||
      !address_delivery ||
      !final_price ||
      !album_name
    ) {
      alert('Все поля должны быть заполнены');
      return;
    }

    let formatArr = typeof format === 'string' ? format.split(',').map(f => f.trim()) : [];
    let photosArr = typeof photos_on_page === 'string' ? photos_on_page.split(',').map(f => f.trim()) : [];

    let laminationStr = typeof lamination === 'string' ? lamination.split('/')[0].trim() : '';

    axios.post('http://localhost:3001/api/printing', {
      main_card_photo,
      main_album_name,
      main_card_description,
      name_on_page,
      photos_on_page: photosArr,
      product_description,
      additional_information,
      format: formatArr,
      basis_for_spread,
      price_of_spread,
      lamination: laminationStr,
      copy_price,
      address_delivery,
      final_price,
      album_name
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
    setEditableStudio({ ...studio });
    setIsEditingStudio(true);
    setShowAddStudioForm(false);
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
    if (!typographyId) {
      alert('Ошибка: не удалось определить идентификатор типографии для удаления.');
      return;
    }
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
    navigate('/admin');
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setUploadError('');
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Можно загружать только изображения (jpg, png, jpeg, webp, gif и др.)');
      return;
    }
    await uploadPhoto(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileChange = async (e) => {
    setUploadError('');
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Можно загружать только изображения (jpg, png, jpeg, webp, gif и др.)');
      return;
    }
    await uploadPhoto(file);
  };

  const uploadPhoto = async (file) => {
    setUploading(true);
    setUploadError('');
    try {
      const formData = new FormData();
      formData.append('photo', file);
      const res = await axios.post('http://localhost:3001/api/photostudios/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data && res.data.filename) {
        setEditableStudio(prev => ({
          ...prev,
          photo: res.data.filename // теперь это полный путь для <img src=...>
        }));
      }
    } catch (err) {
      setUploadError('Ошибка загрузки файла');
    } finally {
      setUploading(false);
    }
  };

  const handleEditPhotoClick = (studioId) => {
    setEditingPhotoStudioId(studioId);
    setUploadError('');
  };

  const handleEditPhotoFileChange = async (e, studio) => {
    setUploadError('');
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Можно загружать только изображения (jpg, png, jpeg, webp, gif и др.)');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('photo', file);
      const res = await axios.post('http://localhost:3001/api/photostudios/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data && res.data.filename) {
        // Обновляем только поле photo для этой студии
        await axios.put(`http://localhost:3001/api/photostudios/${studio.id}`, {
          ...studio,
          photo: res.data.filename
        });
        fetchStudios();
        setEditingPhotoStudioId(null);
        setUploadError('');
      }
    } catch (err) {
      setUploadError('Ошибка загрузки файла');
    } finally {
      setUploading(false);
    }
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
                  .map((key) => (
                    <td key={`${studio.id}-${key}`}>
                      {key === 'photo' ? (
                        <div style={{ width: 90, height: 60, background: '#eee', borderRadius: 6, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                          {studio[key] && (
                            studio[key].startsWith('/src/components/assets/images/Photostudios/') ? (
                              <img src={studio[key]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <div className={`studio-image ${studio[key]}`} style={{ width: '100%', height: '100%' }} />
                            )
                          )}
                          {isEditingStudio && editableStudio.id === studio.id ? null : (
                            <>
                              <button
                                type="button"
                                className="edit-database-button"
                                style={{ position: 'absolute', bottom: 4, right: 4, fontSize: 12, padding: '2px 8px' }}
                                onClick={() => handleEditPhotoClick(studio.id)}
                              >
                                Изм. фото
                              </button>
                              {editingPhotoStudioId === studio.id && (
                                <input
                                  type="file"
                                  accept="image/*"
                                  ref={editingPhotoInputRef}
                                  style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                  onChange={e => handleEditPhotoFileChange(e, studio)}
                                  onClick={e => e.stopPropagation()}
                                />
                              )}
                            </>
                          )}
                        </div>
                      ) : (
                        isEditingStudio && editableStudio.id === studio.id ? (
                          <input
                            type="text"
                            name={key}
                            value={editableStudio[key] || ''}
                            onChange={(e) => handleInputChange(e, setEditableStudio)}
                            style={{ minWidth: 120 }}
                          />
                        ) : (
                          Array.isArray(studio[key])
                            ? studio[key].join(', ')
                            : typeof studio[key] === 'object' && studio[key] !== null
                              ? JSON.stringify(studio[key])
                              : studio[key]
                        )
                      )}
                    </td>
                  ))}
                <td key={`${studio.id}-actions`}>
                  {isEditingStudio && editableStudio.id === studio.id ? (
                    <>
                      <button
                        className="edit-database-button"
                        onClick={handleSaveStudio}
                        disabled={savingStudio}
                      >
                        Сохранить
                      </button>
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
            background: '#fff',
            border: '1.5px solid #ececec',
            borderRadius: 12,
            maxWidth: 490,
            minWidth: 220,
            margin: '24px auto',
            boxShadow: '0 2px 8px rgba(245,185,30,0.07)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            padding: 0
          }}
          onSubmit={e => { e.preventDefault(); handleSaveNewStudio(); }}
        >
          <div
            className={`studio-image`}
            style={{
              width: '100%',
              minHeight: 180,
              height: '30vw',
              maxHeight: 370,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              backgroundColor: '#fafafa',
              backgroundImage: editableStudio.photo
                ? (
                    editableStudio.photo.startsWith('/src/components/assets/images/Photostudios/')
                      ? `url(${editableStudio.photo})`
                      : `url('/src/components/assets/images/Photostudios/${editableStudio.photo}')`
                  )
                : undefined
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#aaa',
              fontSize: 18,
              fontWeight: 500,
              opacity: editableStudio.photo ? 0 : 1,
              pointerEvents: 'none'
            }}>
              {uploading ? 'Загрузка...' : 'Перетащите фото сюда или выберите файл'}
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <button
              type="button"
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: '#fff',
                border: '1px solid #ccc',
                borderRadius: 6,
                padding: '4px 10px',
                cursor: 'pointer',
                fontSize: 13,
                zIndex: 2
              }}
              onClick={e => {
                e.preventDefault();
                fileInputRef.current && fileInputRef.current.click();
              }}
            >
              Выбрать файл
            </button>
          </div>
          {uploadError && (
            <div style={{ color: 'red', textAlign: 'center', marginTop: 6 }}>{uploadError}</div>
          )}
          <div className="studio-info" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <h4 style={{ marginTop: 0, color: '#C17900', fontWeight: 700 }}>Добавление фотостудии</h4>
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
            <div style={{ marginBottom: 10 }}>
              <label>Контактная информация</label>
              <input
                type="text"
                name="contact_information"
                value={editableStudio.contact_information || ''}
                onChange={e => handleInputChange(e, setEditableStudio)}
                style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Описание</label>
              <textarea
                name="description"
                value={editableStudio.description || ''}
                onChange={e => handleInputChange(e, setEditableStudio)}
                style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
                rows={3}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Бронирование (true/false)</label>
              <input
                type="text"
                name="booking"
                value={editableStudio.booking || ''}
                onChange={e => handleInputChange(e, setEditableStudio)}
                style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
                placeholder="true или false"
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Дата создания</label>
              <input
                type="datetime-local"
                name="date_of_creation"
                value={editableStudio.date_of_creation || ''}
                onChange={e => handleInputChange(e, setEditableStudio)}
                style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Дата изменения</label>
              <input
                type="datetime-local"
                name="date_of_editing"
                value={editableStudio.date_of_editing || ''}
                onChange={e => handleInputChange(e, setEditableStudio)}
                style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
              />
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button className="edit-database-button" type="submit" style={{ flex: 1 }}>Сохранить</button>
              <button
                className="edit-database-button"
                type="button"
                style={{ flex: 1 }}
                onClick={() => { setShowAddStudioForm(false); setEditableStudio({}); }}
              >
                Отмена
              </button>
            </div>
          </div>
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
                        'date_of_creation',
                        'date_of_editing',
                        'additional_information'
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
              <tr key={typography.typographyId || typography.id}>
                {Object.keys(typography)
                  .filter(
                    key =>
                      ![
                        'date_of_creation',
                        'date_of_editing',
                        'additional_information'
                      ].includes(key)
                  )
                  .map((key) => (
                    <td key={`${typography.typographyId || typography.id}-${key}`}>
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
                          Array.isArray(typography[key])
                            ? typography[key].join(', ')
                            : typography[key]
                        )
                      )}
                    </td>
                  ))}
                <td key={`${typography.typographyId || typography.id}-actions`}>
                  {isEditingTypography && editableTypography.typographyId === typography.typographyId ? (
                    <>
                      <button className="edit-database-button" onClick={handleSaveTypography}>Сохранить</button>
                      <button className="edit-database-button" onClick={handleCancelEdit}>Отмена</button>
                    </>
                  ) : (
                    <>
                      <button className="edit-database-button" onClick={() => handleEditTypography(typography)}>Редактировать</button>
                      <button
                        className="edit-database-button delete"
                        onClick={() => handleDeleteTypography(typography.typographyId || typography.id)}
                        disabled={!(typography.typographyId || typography.id)}
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
      </div>
      {!showAddTypographyForm && (
        <button className="add-typography-button" onClick={handleAddTypography}>Добавить типографию</button>
      )}
      {showAddTypographyForm && (
        <>
          <div style={{ margin: '10px 0', color: '#888', fontSize: 14 }}>
            <b>Примечание:</b> Перед отправкой на сервер, если пользователь ввёл строку с разделителями (например, "30, 40, 50"), преобразуйте её в массив по этим разделителям.<br />
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
              <label>main_card_photo</label>
              <input
                type="text"
                name="main_card_photo"
                value={editableTypography.main_card_photo || ''}
                onChange={e => handleInputChange(e, setEditableTypography)}
                style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>main_album_name</label>
              <input
                type="text"
                name="main_album_name"
                value={editableTypography.main_album_name || ''}
                onChange={e => handleInputChange(e, setEditableTypography)}
                style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>main_card_description</label>
              <input
                type="text"
                name="main_card_description"
                value={editableTypography.main_card_description || ''}
                onChange={e => handleInputChange(e, setEditableTypography)}
                style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>name_on_page</label>
              <input
                type="text"
                name="name_on_page"
                value={editableTypography.name_on_page || ''}
                onChange={e => handleInputChange(e, setEditableTypography)}
                style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>photos_on_page (через запятую)</label>
              <input
                type="text"
                name="photos_on_page"
                value={editableTypography.photos_on_page || ''}
                onChange={e => handleInputChange(e, setEditableTypography)}
                style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
                placeholder="photo1.jpg, photo2.jpg"
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>product_description</label>
              <input
                type="text"
                name="product_description"
                value={editableTypography.product_description || ''}
                onChange={e => handleInputChange(e, setEditableTypography)}
                style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>additional_information</label>
              <input
                type="text"
                name="additional_information"
                value={editableTypography.additional_information || ''}
                onChange={e => handleInputChange(e, setEditableTypography)}
                style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>format (через запятую)</label>
              <input
                type="text"
                name="format"
                value={editableTypography.format || ''}
                onChange={e => handleInputChange(e, setEditableTypography)}
                style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
                required
                placeholder="30, 40, 50"
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>basis_for_spread</label>
              <input
                type="text"
                name="basis_for_spread"
                value={editableTypography.basis_for_spread || ''}
                onChange={e => handleInputChange(e, setEditableTypography)}
                style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>price_of_spread</label>
              <input
                type="number"
                name="price_of_spread"
                value={editableTypography.price_of_spread || ''}
                onChange={e => handleInputChange(e, setEditableTypography)}
                style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>lamination</label>
              <input
                type="text"
                name="lamination"
                value={editableTypography.lamination || ''}
                onChange={e => handleInputChange(e, setEditableTypography)}
                style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>copy_price</label>
              <input
                type="number"
                name="copy_price"
                value={editableTypography.copy_price || ''}
                onChange={e => handleInputChange(e, setEditableTypography)}
                style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>address_delivery</label>
              <input
                type="text"
                name="address_delivery"
                value={editableTypography.address_delivery || ''}
                onChange={e => handleInputChange(e, setEditableTypography)}
                style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>final_price</label>
              <input
                type="number"
                name="final_price"
                value={editableTypography.final_price || ''}
                onChange={e => handleInputChange(e, setEditableTypography)}
                style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>album_name</label>
              <input
                type="text"
                name="album_name"
                value={editableTypography.album_name || ''}
                onChange={e => handleInputChange(e, setEditableTypography)}
                style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
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