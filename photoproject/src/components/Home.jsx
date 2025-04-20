import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Home.css';

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    photostudio: '',
    printing: ''
  });
  const [photostudios, setPhotostudios] = useState([]);
  const [printings, setPrintings] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/auth/check', { withCredentials: true })
      .then(response => {
        if (response.data.isAuthenticated) {
          toast.success('Добро пожаловать на главную страницу!');
        }
      })
      .catch(() => toast.error('Ошибка проверки авторизации.'));

    // Загрузка списка фотостудий и типографий
    const fetchData = async () => {
      try {
        const photostudiosResponse = await axios.get('http://localhost:3001/api/photostudios');
        setPhotostudios(photostudiosResponse.data);

        const printingsResponse = await axios.get('http://localhost:3001/api/printing');
        setPrintings(printingsResponse.data);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Данные формы:', formData);
    setIsModalOpen(false);
  };

  return (
    <div className="home">
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
      <main className="main-content">
        <div className="background-image"></div>
        <div className="description">
          PhotoProject - молодая компания, занимающаяся организацией фотосессий
        </div>
        <div className="services-container">
          <div className="services">
            <div className="service-box">Помогаем с выбором фотостудий</div>
            <div className="service-box">Подберем лучший вариант для типографии</div>
          </div>
          <div className="services">
            <div className="service-box">Обработаем все фотографии со съемки</div>
            <div className="service-box">Выберем удобные даты для бронирования</div>
          </div>
        </div>
        <button className="cta-button" onClick={() => setIsModalOpen(true)}>Создать заявку</button>
      </main>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Создать заявку</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ФИО</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={(e) => {
                const value = e.target.value.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, ''); // Удаляем все символы, кроме букв и пробелов
                setFormData({ ...formData, fullName: value });
              }}
              required
            />
          </div>
          <div className="form-group">
            <label>Номер телефона</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // Удаляем все символы, кроме цифр
                setFormData({ ...formData, phoneNumber: value });
              }}
              required
            />
          </div>
          <div className="form-group">
            <label>Фотостудия</label>
            <select
              name="photostudio"
              value={formData.photostudio}
              onChange={handleInputChange}
              required
            >
              <option value="">Выберите фотостудию</option>
              {photostudios.map((studio) => (
                <option key={studio.id} value={studio.studio}>
                  {studio.studio}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Типография</label>
            <select
              name="printing"
              value={formData.printing}
              onChange={handleInputChange}
              required
            >
              <option value="">Выберите типографию</option>
              {printings.map((printing) => (
                <option key={printing.id} value={printing.main_album_name}>
                  {printing.main_album_name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="submit-button">Отправить</button>
        </form>
      </Modal>
    </div>
  );
}

export default Home;