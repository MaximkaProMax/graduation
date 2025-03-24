import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Home.css';

function Home() {
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    console.log('Проверка isAuthenticated в localStorage при загрузке Home:', isAuthenticated);
    if (isAuthenticated === 'true') {
      toast.success('Успешная авторизация! Добро пожаловать на главную страницу!');
      console.log('Значение isAuthenticated в localStorage после проверки:', localStorage.getItem('isAuthenticated'));
    }
  }, []);

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
        <button className="cta-button">Создать заявку</button>
      </main>
    </div>
  );
}

export default Home;