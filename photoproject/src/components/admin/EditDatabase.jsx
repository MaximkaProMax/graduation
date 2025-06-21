import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/EditDatabase.css';
import { useNavigate } from 'react-router-dom';
import { checkPageAccess } from '../../utils/checkPageAccess';

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
  const [editingPhotoTypographyId, setEditingPhotoTypographyId] = useState(null);
  const [editingPhotoOnPage, setEditingPhotoOnPage] = useState({ typographyId: null, photoIdx: null });
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef(null);
  const editingPhotoInputRef = useRef(null);
  const typographyPhotoInputRef = useRef(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    checkPageAccess('EditDatabase', navigate, setIsAuthorized, setIsLoading);
  }, [navigate]);

  useEffect(() => {
    if (isAuthorized) {
      fetchStudios();
      fetchTypographies();
    }
  }, [isAuthorized]);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!isAuthorized) {
    return null; // Не отображаем ничего, если пользователь не авторизован
  }

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
    const { id, ...updateData } = editableTypography;

    // Преобразуем format и photos_on_page в массивы строк
    if (typeof updateData.format === 'string') {
      updateData.format = updateData.format.split(',').map(f => f.trim()).filter(Boolean);
    }
    if (typeof updateData.photos_on_page === 'string') {
      updateData.photos_on_page = updateData.photos_on_page.split(',').map(f => f.trim()).filter(Boolean);
    }

    // lamination — всегда строка (в БД), берем первый элемент если массив
    if (Array.isArray(updateData.lamination)) {
      updateData.lamination = updateData.lamination[0] || '';
    }

    // price_of_spread, copy_price, final_price — числа
    if (updateData.price_of_spread !== undefined && updateData.price_of_spread !== '') {
      updateData.price_of_spread = Number(updateData.price_of_spread);
    }
    if (updateData.copy_price !== undefined && updateData.copy_price !== '') {
      updateData.copy_price = Number(updateData.copy_price);
    }
    if (updateData.final_price !== undefined && updateData.final_price !== '') {
      updateData.final_price = Number(updateData.final_price);
    }

    // Удаляем id, если есть
    delete updateData.id;

    // Проверяем, что все обязательные поля заполнены (можно скорректировать по вашей модели)
    // ...оставьте свою валидацию, если нужно...

    axios.put(`http://localhost:3001/api/printing/${id}`, updateData)
      .then(() => {
        fetchTypographies();
        setIsEditingTypography(false);
        setEditableTypography({});
      })
      .catch(error => {
        console.error('Ошибка при обновлении данных типографии:', error);
      });
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

    // Отладочные сообщения для проверки значений полей
    console.log('DEBUG: name_on_page:', name_on_page);
    console.log('DEBUG: photos_on_page:', photos_on_page);
    console.log('DEBUG: product_description:', product_description);
    console.log('DEBUG: additional_information:', additional_information);
    console.log('DEBUG: price_of_spread:', price_of_spread);
    console.log('DEBUG: copy_price:', copy_price);

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

    // Преобразуем format и photos_on_page в массивы строк
    let formatArr = typeof format === 'string' ? format.split(',').map(f => f.trim()).filter(Boolean) : Array.isArray(format) ? format : [];
    let photosArr = typeof photos_on_page === 'string' ? photos_on_page.split(',').map(f => f.trim()).filter(Boolean) : Array.isArray(photos_on_page) ? photos_on_page : [];

    // lamination — всегда строка (в БД), берем первый элемент если массив
    let laminationStr = Array.isArray(lamination) ? (lamination[0] || '') : (typeof lamination === 'string' ? lamination : '');

    // price_of_spread, copy_price, final_price — числа
    const priceOfSpreadNum = price_of_spread !== undefined && price_of_spread !== '' ? Number(price_of_spread) : null;
    const copyPriceNum = copy_price !== undefined && copy_price !== '' ? Number(copy_price) : null;
    const finalPriceNum = final_price !== undefined && final_price !== '' ? Number(final_price) : null;

    // Отладочный вывод перед отправкой на сервер
    // (Показывает итоговый payload, который отправляется на сервер)
    console.log('DEBUG: payload for POST /printing', {
      main_card_photo,
      main_album_name,
      main_card_description,
      name_on_page,
      photos_on_page: photosArr,
      product_description,
      additional_information,
      format: formatArr,
      basis_for_spread,
      price_of_spread: priceOfSpreadNum,
      lamination: laminationStr,
      copy_price: copyPriceNum,
      address_delivery,
      final_price: finalPriceNum,
      album_name
    });

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
      price_of_spread: priceOfSpreadNum,
      lamination: laminationStr,
      copy_price: copyPriceNum,
      address_delivery,
      final_price: finalPriceNum,
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
      album_name: '',
      // добавляем новые поля
      name_on_page: '',
      photos_on_page: '',
      product_description: '',
      additional_information: '',
      price_of_spread: '',
      copy_price: ''
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

  const handleEditTypographyPhotoFileChange = async (e, typography) => {
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
      const res = await axios.post('http://localhost:3001/api/photostudios/upload-printing', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data && res.data.filename) {
        // Обновляем только поле main_card_photo для этой типографии
        await axios.put(`http://localhost:3001/api/printing/${typography.id}`, {
          ...typography,
          main_card_photo: res.data.filename
        });
        fetchTypographies();
        setEditingPhotoTypographyId(null);
        setUploadError('');
      }
    } catch (err) {
      setUploadError('Ошибка загрузки файла');
    } finally {
      setUploading(false);
    }
  };

  const handleEditTypographyPhotoClick = (typographyId) => {
    setEditingPhotoTypographyId(typographyId);
    setUploadError('');
  };

  const handleEditPhotoOnPageClick = (typographyId, photoIdx) => {
    setEditingPhotoOnPage({ typographyId, photoIdx });
  };

  const handleEditPhotoOnPageFileChange = async (e, typography, photoIdx) => {
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
      formData.append('photos', file);
      // Используем эндпоинт для загрузки фото для страницы
      const res = await axios.post('http://localhost:3001/api/photostudios/upload-printing-multi', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data && Array.isArray(res.data.filenames) && res.data.filenames[0]) {
        // Заменяем только одну фотографию по индексу
        const updatedPhotos = Array.isArray(typography.photos_on_page)
          ? [...typography.photos_on_page]
          : (typeof typography.photos_on_page === 'string'
              ? typography.photos_on_page.split(',').map(f => f.trim()).filter(Boolean)
              : []);
        updatedPhotos[photoIdx] = res.data.filenames[0];
        await axios.put(`http://localhost:3001/api/printing/${typography.id}`, {
          ...typography,
          photos_on_page: updatedPhotos
        });
        fetchTypographies();
        setEditingPhotoOnPage({ typographyId: null, photoIdx: null });
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
      <div className="edit-database-table-container">
        <table className="edit-database-table">
          <thead>
            <tr>
              {studios.length > 0 &&
                Object.keys(studios[0])
                  .filter(
                    key =>
                      key !== 'contact_information' &&
                      key !== 'description' &&
                      key !== 'booking'
                  )
                  .map((key) => (
                    <th key={key}>{key}</th>
                  ))}
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {[...studios]
              .sort((a, b) => (a.id || 0) - (b.id || 0))
              .map((studio) => (
                <tr key={studio.id}>
                  {Object.keys(studio)
                    .filter(
                      key =>
                        key !== 'contact_information' &&
                        key !== 'description' &&
                        key !== 'booking'
                    )
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
                    <div className="edit-database-actions">
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
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <h3>Типографии</h3>
      <div className="edit-database-table-container">
        <table className="edit-database-table">
          <thead>
            <tr>
              {typographies.length > 0 &&
                Object.keys(typographies[0])
                  .map((key) => (
                    <th key={key}>{key}</th>
                  ))}
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {[...typographies]
              .sort((a, b) => (a.id || 0) - (b.id || 0))
              .map((typography) => (
                <tr key={typography.id}>
                  {Object.keys(typography)
                    .map((key) => (
                      <td key={`${typography.id}-${key}`}>
                        {key === 'main_card_photo' ? (
                          <div style={{ width: 90, height: 60, background: '#eee', borderRadius: 6, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                            {typography[key] && (
                              typography[key].startsWith('/src/components/assets/images/Printing/') ? (
                                <img src={typography[key]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <div className={`printing-image ${typography[key]}`} style={{ width: '100%', height: '100%' }} />
                              )
                            )}
                            {isEditingTypography && editableTypography.id === typography.id ? null : (
                              <>
                                <button
                                  type="button"
                                  className="edit-database-button"
                                  style={{ position: 'absolute', bottom: 4, right: 4, fontSize: 12, padding: '2px 8px' }}
                                  onClick={() => handleEditTypographyPhotoClick(typography.id)}
                                >
                                  Изм. фото
                                </button>
                                {editingPhotoTypographyId === typography.id && (
                                  <input
                                    type="file"
                                    accept="image/*"
                                    ref={typographyPhotoInputRef}
                                    style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                    onChange={e => handleEditTypographyPhotoFileChange(e, typography)}
                                    onClick={e => e.stopPropagation()}
                                  />
                                )}
                              </>
                            )}
                          </div>
                        ) : key === 'photos_on_page' ? (
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                            {(Array.isArray(typography.photos_on_page)
                              ? typography.photos_on_page
                              : (typeof typography.photos_on_page === 'string'
                                  ? typography.photos_on_page.split(',').map(f => f.trim()).filter(Boolean)
                                  : [])
                            ).map((photo, idx) => (
                              <div key={idx} style={{ position: 'relative', width: 60, height: 40, background: '#eee', borderRadius: 6, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {photo && (
                                  <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                )}
                                <button
                                  type="button"
                                  className="edit-database-button"
                                  style={{ position: 'absolute', bottom: 2, right: 2, fontSize: 10, padding: '1px 6px', zIndex: 2 }}
                                  onClick={() => handleEditPhotoOnPageClick(typography.id, idx)}
                                >
                                  Изм. фото
                                </button>
                                {editingPhotoOnPage.typographyId === typography.id && editingPhotoOnPage.photoIdx === idx && (
                                  <input
                                    type="file"
                                    accept="image/*"
                                    style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 3 }}
                                    onChange={e => handleEditPhotoOnPageFileChange(e, typography, idx)}
                                    onClick={e => e.stopPropagation()}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          isEditingTypography && editableTypography.id === typography.id ? (
                            <input
                              type={['price_of_spread', 'copy_price'].includes(key) ? 'number' : 'text'}
                              name={key}
                              value={editableTypography[key] || ''}
                              onChange={(e) => handleInputChange(e, setEditableTypography)}
                              style={{ minWidth: 120 }}
                            />
                          ) : (
                            Array.isArray(typography[key])
                              ? typography[key].join(', ')
                              : typography[key]
                          )
                        )}
                      </td>
                    ))}
                  <td>
                    <div className="edit-database-actions">
                    {isEditingTypography && editableTypography.id === typography.id ? (
                      <>
                        <button className="edit-database-button" onClick={handleSaveTypography}>Сохранить</button>
                        <button className="edit-database-button" onClick={handleCancelEdit}>Отмена</button>
                      </>
                    ) : (
                      <>
                        <button className="edit-database-button" onClick={() => handleEditTypography(typography)}>Редактировать</button>
                        <button className="edit-database-button delete" onClick={() => handleDeleteTypography(typography.id)}>Удалить</button>
                      </>
                    )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EditDatabase;