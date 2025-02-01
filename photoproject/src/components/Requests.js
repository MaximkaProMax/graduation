import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Requests.css';
import { useNavigate } from 'react-router-dom';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = () => {
    axios.get('http://localhost:3001/api/requests')
      .then(response => {
        setRequests(response.data);
      })
      .catch(error => {
        console.error('Ошибка при получении заявок:', error);
      });
  };

  const handleAddRequest = () => {
    // Логика для добавления заявки
  };

  const handleEditRequest = (requestId) => {
    // Логика для редактирования заявки
  };

  const handleDeleteRequest = (requestId) => {
    // Логика для удаления заявки
  };

  const handleSendRequest = (requestId) => {
    // Логика для отправки заявки партнерам
  };

  const handleDownloadPDF = (requestId) => {
    // Логика для скачивания заявки в формате PDF
  };

  const handleBackClick = () => {
    navigate('/manager'); // Переход на страницу Manager
  };

  return (
    <div className="requests-container">
      <h2>Управление заявками на фотосессии</h2>
      <button className="back-button" onClick={handleBackClick}>Назад</button>
      <div className="table-container">
        <table className="requests-table">
          <thead>
            <tr>
              <th>id</th>
              <th>Пользователь</th>
              <th>Менеджер</th>
              <th>Студия</th>
              <th>Дата</th>
              <th>Время в студии</th>
              <th>Типография</th>
              <th>Формат</th>
              <th>Основа разворота</th>
              <th>Кол-во разворотов</th>
              <th>Ламинация</th>
              <th>Количество экземпляров</th>
              <th>Дата типографии</th>
              <th>Адрес доставки</th>
              <th>Платеж</th>
              <th>Ответ на комментарий</th>
              <th>Статус</th>
              <th>Дата создания</th>
              <th>Дата редактирования</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.user}</td>
                <td>{request.manager}</td>
                <td>{request.studio}</td>
                <td>{request.date}</td>
                <td>{request.timeInStudio}</td>
                <td>{request.typography}</td>
                <td>{request.format}</td>
                <td>{request.base}</td>
                <td>{request.pages}</td>
                <td>{request.lamination}</td>
                <td>{request.copies}</td>
                <td>{request.typographyDate}</td>
                <td>{request.deliveryAddress}</td>
                <td>{request.payment}</td>
                <td>{request.commentResponse}</td>
                <td>{request.status}</td>
                <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                <td>{new Date(request.updatedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="buttons-container">
        <button className="request-button" onClick={handleAddRequest}>Создать заявку</button>
        <button className="request-button" onClick={() => handleEditRequest(requests.map(r => r.id))}>Редактировать заявку</button>
        <button className="request-button" onClick={() => handleDeleteRequest(requests.map(r => r.id))}>Удалить заявку</button>
        <button className="request-button" onClick={() => handleSendRequest(requests.map(r => r.id))}>Отправить заявку партнерам</button>
        <button className="request-button" onClick={() => handleDownloadPDF(requests.map(r => r.id))}>Скачать PDF</button>
      </div>
    </div>
  );
};

export default Requests;