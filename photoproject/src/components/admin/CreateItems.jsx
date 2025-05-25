import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateItems.css';

const CreateItems = () => {
  const [studio, setStudio] = useState({
    studio: '',
    address: '',
    opening_hours: '',
    price: '',
    photo: ''
  });
  const [typography, setTypography] = useState({
    main_card_photo: '',
    main_album_name: '',
    main_card_description: '',
    name_on_page: '',
    photos_on_page: '',
    product_description: '',
    additional_information: '',
    format: '',
    basis_for_spread: '',
    price_of_spread: '',
    lamination: '',
    copy_price: '',
    address_delivery: '',
    final_price: '',
    album_name: ''
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);
  const typographyPhotoInputRef = useRef(null);
  const photosOnPageInputRef = useRef(null);
  const photosOnPageFileInputRef = useRef(null);
  const navigate = useNavigate();

  // --- Форма фотостудии ---
  const handleStudioChange = e => {
    const { name, value } = e.target;
    setStudio(prev => ({ ...prev, [name]: value }));
  };
  const handleStudioFileChange = async (e) => {
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
        setStudio(prev => ({ ...prev, photo: res.data.filename }));
      }
    } catch {
      setUploadError('Ошибка загрузки файла');
    } finally {
      setUploading(false);
    }
  };
  const handleStudioSubmit = e => {
    e.preventDefault();
    const { studio: s, address, opening_hours, price, photo } = studio;
    if (!s || !address || !opening_hours || !price) {
      alert('Все поля должны быть заполнены');
      return;
    }
    axios.post('http://localhost:3001/api/photostudios', {
      studio: s,
      address,
      opening_hours,
      price,
      photo: photo || ''
    })
      .then(() => {
        alert('Фотостудия добавлена!');
        setStudio({
          studio: '',
          address: '',
          opening_hours: '',
          price: '',
          photo: ''
        });
      })
      .catch(() => alert('Ошибка при добавлении фотостудии'));
  };

  // --- Форма типографии ---
  const handleTypographyChange = e => {
    const { name, value } = e.target;
    setTypography(prev => ({ ...prev, [name]: value }));
  };
  const handleTypographyPhotoChange = e => {
    const value = e.target.value;
    setTypography(prev => ({ ...prev, main_card_photo: value }));
  };
  const handleTypographyPhotoPaste = e => {
    const value = e.clipboardData.getData('text');
    setTypography(prev => ({ ...prev, main_card_photo: value }));
  };
  // Загрузка файла для типографии (аналогично фотостудии)
  const handleTypographyFileChange = async (e) => {
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
      // Новый эндпоинт для загрузки в папку Printing
      const res = await axios.post('http://localhost:3001/api/photostudios/upload-printing', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data && res.data.filename) {
        setTypography(prev => ({ ...prev, main_card_photo: res.data.filename }));
      }
    } catch {
      setUploadError('Ошибка загрузки файла');
    } finally {
      setUploading(false);
    }
  };
  // Drag and drop для типографии
  const handleTypographyDrop = async (e) => {
    e.preventDefault();
    setUploadError('');
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Можно загружать только изображения (jpg, png, jpeg, webp, gif и др.)');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('photo', file);
      // Новый эндпоинт для загрузки в папку Printing
      const res = await axios.post('http://localhost:3001/api/photostudios/upload-printing', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data && res.data.filename) {
        setTypography(prev => ({ ...prev, main_card_photo: res.data.filename }));
      }
    } catch {
      setUploadError('Ошибка загрузки файла');
    } finally {
      setUploading(false);
    }
  };

  // Новый: загрузка нескольких фото для photos_on_page
  const handlePhotosOnPageFileChange = async (e) => {
    setUploadError('');
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      setUploadError('Можно загружать только изображения (jpg, png, jpeg, webp, gif и др.)');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      validFiles.forEach(file => formData.append('photos', file));
      // Новый эндпоинт для загрузки нескольких файлов
      const res = await axios.post('http://localhost:3001/api/photostudios/upload-printing-multi', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data && Array.isArray(res.data.filenames)) {
        setTypography(prev => ({
          ...prev,
          photos_on_page: [
            ...(prev.photos_on_page
              ? prev.photos_on_page.split(',').map(f => f.trim()).filter(Boolean)
              : []),
            ...res.data.filenames
          ].join(', ')
        }));
      }
    } catch {
      setUploadError('Ошибка загрузки файлов');
    } finally {
      setUploading(false);
      // Сброс input для повторной загрузки тех же файлов
      if (photosOnPageFileInputRef.current) photosOnPageFileInputRef.current.value = '';
    }
  };

  const handleTypographySubmit = e => {
    e.preventDefault();
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
    } = typography;

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

    let formatArr = typeof format === 'string' ? format.split(',').map(f => f.trim()).filter(Boolean) : [];
    let photosArr = typeof photos_on_page === 'string' ? photos_on_page.split(',').map(f => f.trim()).filter(Boolean) : [];
    let laminationStr = typeof lamination === 'string' ? lamination.split('/')[0].trim() : '';
    const priceOfSpreadNum = price_of_spread !== '' ? Number(price_of_spread) : null;
    const copyPriceNum = copy_price !== '' ? Number(copy_price) : null;
    const finalPriceNum = final_price !== '' ? Number(final_price) : null;

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
        alert('Типография добавлена!');
        setTypography({
          main_card_photo: '',
          main_album_name: '',
          main_card_description: '',
          name_on_page: '',
          photos_on_page: '',
          product_description: '',
          additional_information: '',
          format: '',
          basis_for_spread: '',
          price_of_spread: '',
          lamination: '',
          copy_price: '',
          address_delivery: '',
          final_price: '',
          album_name: ''
        });
      })
      .catch(() => alert('Ошибка при добавлении типографии'));
  };

  return (
    <div className="create-items-container">
      <h2>Создание элементов</h2>
      <button
        onClick={() => navigate(-1)}
        className="back-btn"
        style={{
          background: '#6c757d',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '8px 18px',
          marginBottom: 24,
          cursor: 'pointer'
        }}
      >
        Назад
      </button>

      {/* Форма добавления фотостудии */}
      <h3>Добавить фотостудию</h3>
      <form onSubmit={handleStudioSubmit} style={{ marginBottom: 40 }}>
        <div
          className="studio-image"
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
            backgroundImage: studio.photo
              ? (
                  studio.photo.startsWith('/src/components/assets/images/Photostudios/')
                    ? `url(${studio.photo})`
                    : `url('/src/components/assets/images/Photostudios/${studio.photo}')`
                )
              : undefined,
            marginBottom: 10,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            cursor: 'pointer'
          }}
          onClick={e => {
            if (e.target.tagName !== 'INPUT') {
              fileInputRef.current && fileInputRef.current.click();
            }
          }}
          onDrop={e => {
            e.preventDefault();
            setUploadError('');
            const file = e.dataTransfer.files[0];
            if (!file) return;
            if (!file.type.startsWith('image/')) {
              setUploadError('Можно загружать только изображения (jpg, png, jpeg, webp, gif и др.)');
              return;
            }
            setUploading(true);
            const formData = new FormData();
            formData.append('photo', file);
            axios.post('http://localhost:3001/api/photostudios/upload', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            }).then(res => {
              if (res.data && res.data.filename) {
                setStudio(prev => ({ ...prev, photo: res.data.filename }));
              }
            }).catch(() => {
              setUploadError('Ошибка загрузки файла');
            }).finally(() => setUploading(false));
          }}
          onDragOver={e => e.preventDefault()}
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
            opacity: studio.photo ? 0 : 1,
            pointerEvents: 'none'
          }}>
            {uploading ? 'Загрузка...' : 'Перетащите фото сюда или выберите файл'}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{
              display: 'none'
            }}
            onChange={handleStudioFileChange}
            tabIndex={-1}
          />
        </div>
        {/* Новое поле: Фото (ссылка на изображение) */}
        <input
          type="text"
          name="photo"
          value={studio.photo}
          onChange={handleStudioChange}
          placeholder="Фото (ссылка на изображение)"
          required
          style={{ width: '100%', marginTop: 4, marginBottom: 8, cursor: 'pointer' }}
          readOnly
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        />
        {uploadError && (
          <div style={{ color: 'red', textAlign: 'center', marginTop: 6 }}>{uploadError}</div>
        )}
        <div style={{ padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            type="text"
            name="studio"
            value={studio.studio}
            onChange={handleStudioChange}
            placeholder="Название студии"
            required
            style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
          />
          <input
            type="text"
            name="address"
            value={studio.address}
            onChange={handleStudioChange}
            placeholder="Адрес"
            required
            style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
          />
          <input
            type="text"
            name="opening_hours"
            value={studio.opening_hours}
            onChange={handleStudioChange}
            placeholder="Время работы"
            required
            style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
          />
          <input
            type="text"
            name="price"
            value={studio.price}
            onChange={handleStudioChange}
            placeholder="Цена"
            required
            style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
          />
          <button
            type="submit"
            style={{
              background: '#f0bb29',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '10px 0',
              width: '100%',
              fontWeight: 600,
              fontSize: 16
            }}
          >
            Добавить фотостудию
          </button>
        </div>
      </form>

      {/* Форма добавления типографии */}
      <h3>Добавить типографию</h3>
      <form onSubmit={handleTypographySubmit}>
        <div
          className="printing-card-image"
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
            backgroundImage: typography.main_card_photo
              ? (
                  typography.main_card_photo.startsWith('/src/components/assets/images/Printing/')
                    ? `url(${typography.main_card_photo})`
                    : `url('/src/components/assets/images/Printing/${typography.main_card_photo}')`
                )
              : undefined,
            marginBottom: 10,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            cursor: 'pointer'
          }}
          onClick={e => {
            if (e.target.tagName !== 'INPUT') {
              typographyPhotoInputRef.current && typographyPhotoInputRef.current.click();
            }
          }}
          onDrop={handleTypographyDrop}
          onDragOver={e => e.preventDefault()}
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
            opacity: typography.main_card_photo ? 0 : 1,
            pointerEvents: 'none'
          }}>
            {uploading ? 'Загрузка...' : (typography.main_card_photo ? '' : 'Перетащите фото сюда или выберите файл')}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={typographyPhotoInputRef}
            style={{
              display: 'none'
            }}
            onChange={handleTypographyFileChange}
            tabIndex={-1}
          />
        </div>
        {/* Оставляем только одно поле для ссылки на изображение */}
        <input
          type="text"
          name="main_card_photo"
          value={typography.main_card_photo}
          onChange={handleTypographyPhotoChange}
          onPaste={handleTypographyPhotoPaste}
          placeholder="Фото (ссылка на изображение)"
          required
          style={{ width: '100%', marginTop: 4, marginBottom: 8, cursor: 'pointer' }}
          readOnly
          onClick={() => typographyPhotoInputRef.current && typographyPhotoInputRef.current.click()}
        />
        {uploadError && (
          <div style={{ color: 'red', textAlign: 'center', marginTop: 6 }}>{uploadError}</div>
        )}
        <div style={{ padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            type="text"
            name="main_album_name"
            value={typography.main_album_name}
            onChange={handleTypographyChange}
            placeholder="Название альбома"
            required
            style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
          />
          <input
            type="text"
            name="main_card_description"
            value={typography.main_card_description}
            onChange={handleTypographyChange}
            placeholder="Описание карточки"
            required
            style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
          />
          <input
            type="text"
            name="name_on_page"
            value={typography.name_on_page}
            onChange={handleTypographyChange}
            placeholder="Название на странице"
            required
            style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
          />
          <input
            type="text"
            name="photos_on_page"
            value={typography.photos_on_page}
            placeholder="Фотографии на странице (через запятую)"
            required
            style={{ width: '100%', marginTop: 4, marginBottom: 8, cursor: 'pointer', background: '#fafafa' }}
            ref={photosOnPageInputRef}
            readOnly
            onClick={() => photosOnPageFileInputRef.current && photosOnPageFileInputRef.current.click()}
          />
          <input
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            ref={photosOnPageFileInputRef}
            onChange={handlePhotosOnPageFileChange}
          />
          {/* Превью загруженных фото */}
          {typography.photos_on_page && typography.photos_on_page.split(',').filter(Boolean).length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
              {typography.photos_on_page.split(',').map((photo, idx) => (
                <img
                  key={idx}
                  src={photo.trim()}
                  alt={`Фото ${idx + 1}`}
                  style={{
                    width: 70,
                    height: 70,
                    objectFit: 'cover',
                    borderRadius: 6,
                    background: '#eee'
                  }}
                />
              ))}
            </div>
          )}
          <input
            type="text"
            name="product_description"
            value={typography.product_description}
            onChange={handleTypographyChange}
            placeholder="Описание продукта"
            required
            style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
          />
          <input
            type="text"
            name="additional_information"
            value={typography.additional_information}
            onChange={handleTypographyChange}
            placeholder="Дополнительная информация"
            required
            style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
          />
          <input
            type="text"
            name="format"
            value={typography.format}
            onChange={handleTypographyChange}
            placeholder="Форматы (через запятую)"
            required
            style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
          />
          <input
            type="text"
            name="basis_for_spread"
            value={typography.basis_for_spread}
            onChange={handleTypographyChange}
            placeholder="Основа разворота"
            required
            style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
          />
          <input
            type="number"
            name="price_of_spread"
            value={typography.price_of_spread}
            onChange={handleTypographyChange}
            placeholder="Цена за разворот"
            required
            style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
          />
          <input
            type="text"
            name="lamination"
            value={typography.lamination}
            onChange={handleTypographyChange}
            placeholder="Ламинация"
            required
            style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
          />
          <input
            type="number"
            name="copy_price"
            value={typography.copy_price}
            onChange={handleTypographyChange}
            placeholder="Цена за копию"
            required
            style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
          />
          <input
            type="text"
            name="address_delivery"
            value={typography.address_delivery}
            onChange={handleTypographyChange}
            placeholder="Адрес доставки"
            required
            style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
          />
          <input
            type="number"
            name="final_price"
            value={typography.final_price}
            onChange={handleTypographyChange}
            placeholder="Итоговая цена"
            required
            style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
          />
          <input
            type="text"
            name="album_name"
            value={typography.album_name}
            onChange={handleTypographyChange}
            placeholder="Название альбома (техническое)"
            required
            style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
          />
          <button
            type="submit"
            style={{
              background: '#f0bb29',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '10px 0',
              width: '100%',
              fontWeight: 600,
              fontSize: 16
            }}
          >
            Добавить типографию
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateItems;
