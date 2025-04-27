import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import './Calendar.css';

const Calendar = () => {
  const location = useLocation();
  const { studio, address, price = 0 } = location.state || {};
  const numericPrice = typeof price === 'string' ? parseFloat(price.replace(/[^\d.-]/g, '')) : price;

  const today = new Date(); // Сегодняшняя дата
  const [selectedDate, setSelectedDate] = useState(today.getDate()); // Устанавливаем сегодняшнюю дату
  const [currentDate, setCurrentDate] = useState(today);
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [bookings, setBookings] = useState([]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [totalCost, setTotalCost] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    calculateTotalCost();
  }, [startTime, endTime, numericPrice]);

  const calculateTotalCost = () => {
    const [startHour] = startTime.split(':').map(Number);
    const [endHour] = endTime.split(':').map(Number);
    const hours = endHour - startHour;
    const cost = hours > 0 ? hours * numericPrice : 0;
    setTotalCost(cost);
  };

  // Вспомогательная функция для форматирования даты в YYYY-MM-DD
  const formatDateForDb = (day, month, year) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  const handleDateClick = (date) => {
    const selectedFullDate = new Date(year, month, date);
    today.setHours(0, 0, 0, 0); // Убираем время для сравнения только дат

    if (selectedFullDate < today) {
      toast.error('Нельзя выбрать прошедшую дату!');
      return;
    }

    setSelectedDate(date);
  };

  const handlePreviousMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }

    if (month - 1 === today.getMonth() && year === today.getFullYear()) {
      setSelectedDate(today.getDate());
    } else {
      setSelectedDate(null);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }

    if (month + 1 === today.getMonth() && year === today.getFullYear()) {
      setSelectedDate(today.getDate());
    } else {
      setSelectedDate(null);
    }
  };

  const handleBookingSubmit = (event) => {
    event.preventDefault();
    if (!selectedDate) {
      toast.error('Пожалуйста, выберите дату!');
      return;
    }

    const newBooking = {
      name: studio,
      date: formatDateForDb(selectedDate, month, year), // исправлено
      startTime: startTime,
      endTime: endTime,
      address: address,
      totalCost: totalCost,
    };
    setBookings([...bookings, newBooking]);
    setSelectedDate(today.getDate()); // Сбрасываем на сегодняшнюю дату
    setStartTime('09:00');
    setEndTime('10:00');
    event.target.reset();

    navigate('/payment');
  };

  const handleAddToCart = async () => {
    if (!selectedDate) {
      toast.error('Пожалуйста, выберите дату перед бронированием!');
      return;
    }

    const bookingDetails = {
      name: studio,
      date: formatDateForDb(selectedDate, month, year), // исправлено
      startTime: startTime,
      endTime: endTime,
      address: address,
      totalCost: totalCost,
    };

    // Отладочное сообщение
    console.log('Данные для бронирования:', bookingDetails);

    try {
      const response = await axios.post('http://localhost:3001/api/bookings/studios/add', bookingDetails, {
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success('Бронирование успешно добавлено!');
      } else {
        toast.error('Ошибка при добавлении бронирования');
      }
    } catch (error) {
      console.error('Ошибка при бронировании:', error);
      toast.error('Ошибка при бронировании');
    }
  };

  const handleMonthChange = (event) => {
    const newMonth = parseInt(event.target.value);
    setMonth(newMonth);

    // Проверяем, если выбран текущий месяц и год, выделяем текущую дату
    if (newMonth === today.getMonth() && year === today.getFullYear()) {
      setSelectedDate(today.getDate());
    } else {
      setSelectedDate(null); // Сбрасываем выделение
    }
  };

  const handleYearChange = (event) => {
    const newYear = parseInt(event.target.value);
    setYear(newYear);

    // Проверяем, если выбран текущий месяц и год, выделяем текущую дату
    if (month === today.getMonth() && newYear === today.getFullYear()) {
      setSelectedDate(today.getDate());
    } else {
      setSelectedDate(null); // Сбрасываем выделение
    }
  };

  const handleStartTimeChange = (event) => {
    const newStartTime = event.target.value;
    const [startHour] = newStartTime.split(':').map(Number);

    const newEndTime = `${String(startHour + 1).padStart(2, '0')}:00`;

    setStartTime(newStartTime);
    setEndTime(newEndTime);
  };

  const handleEndTimeChange = (event) => {
    const newEndTime = event.target.value;
    const [startHour] = startTime.split(':').map(Number);
    const [endHour] = newEndTime.split(':').map(Number);

    if (endHour <= startHour) {
      const correctedEndTime = `${String(startHour + 1).padStart(2, '0')}:00`;
      toast.error('Время окончания не может быть раньше или равно времени начала. Исправлено автоматически.');
      setEndTime(correctedEndTime);
    } else {
      setEndTime(newEndTime);
    }
  };

  const getFirstDayOfMonth = () => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const renderDaysOfWeek = () => {
    const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    return daysOfWeek.map((day, index) => (
      <div key={index} className="day-of-week">
        {day}
      </div>
    ));
  };

  const renderDays = () => {
    const days = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = getFirstDayOfMonth();

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="empty-day"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const isToday =
        i === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      const isSelected = selectedDate === i;

      days.push(
        <div
          key={i}
          className={`day ${isSelected ? 'selected' : ''} ${isToday && !isSelected ? 'today' : ''}`}
          onClick={() => handleDateClick(i)}
        >
          {i}
        </div>
      );
    }
    return days;
  };

  const generateTimeOptions = (start, end) => {
    const options = [];
    for (let hour = start; hour <= end; hour++) {
      const time = `${String(hour).padStart(2, '0')}:00`;
      options.push(<option key={time} value={time}>{time}</option>);
    }
    return options;
  };

  return (
    <div className="calendar-page">
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
      <div className="left-section">
        <h2 className="aligned-header">Бронирование дат</h2>
        <div className="calendar-container">
          <div className="month-selection">
            <button className="month-button" onClick={handlePreviousMonth}>&lt;</button>
            <label>Месяц:</label>
            <select className="month-select" value={month} onChange={handleMonthChange}>
              {Array.from({ length: 12 }, (_, index) => (
                <option key={index} value={index}>
                  {new Date(0, index).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
            <label>Год:</label>
            <select className="year-select" value={year} onChange={handleYearChange}>
              {Array.from({ length: 5 }, (_, index) => (
                <option key={index} value={currentDate.getFullYear() + index}>
                  {currentDate.getFullYear() + index}
                </option>
              ))}
            </select>
            <button className="month-button" onClick={handleNextMonth}>&gt;</button>
          </div>
          <div className="calendar">
            {renderDaysOfWeek()}
            {renderDays()}
          </div>
        </div>
      </div>
      <div className="right-section">
        <div className="booking-form">
          <h2 className="aligned-header">Добавить бронирование</h2>
          <form onSubmit={handleBookingSubmit}>
            <div className="input-group">
              <label>Название</label>
              <input type="text" name="name" value={studio || ''} readOnly />
            </div>
            <div className="input-group">
              <label>Дата</label>
              <input type="text" value={selectedDate ? `${selectedDate}/${month + 1}/${year}` : ''} readOnly />
            </div>
            <div className="input-group">
              <label>Время с</label>
              <select name="startTime" value={startTime} onChange={handleStartTimeChange} required>
                {generateTimeOptions(9, 20)}
              </select>
            </div>
            <div className="input-group">
              <label>Время до</label>
              <select name="endTime" value={endTime} onChange={handleEndTimeChange} required>
                {generateTimeOptions(10, 21)}
              </select>
            </div>
            <div className="input-group">
              <label>Адрес</label>
              <input type="text" name="address" value={address || ''} readOnly />
            </div>
            <div className="input-group">
              <label>Итоговая стоимость</label>
              <input type="text" value={`${totalCost} ₽`} readOnly />
            </div>
            <button type="submit">Оплатить</button>
          </form>
          <button onClick={handleAddToCart}>Забронировать</button>
        </div>
      </div>
    </div>
  );
};

export default Calendar;