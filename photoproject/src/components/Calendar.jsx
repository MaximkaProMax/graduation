import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Calendar.css';

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [month, setMonth] = useState(currentDate.getMonth());
  const [year, setYear] = useState(currentDate.getFullYear());
  const [bookings, setBookings] = useState([]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleBookingSubmit = (event) => {
    event.preventDefault();
    const { name, address } = event.target.elements;
    const newBooking = {
      name: name.value,
      date: `${selectedDate}/${month + 1}/${year}`,
      startTime: startTime,
      endTime: endTime,
      address: address.value
    };
    setBookings([...bookings, newBooking]);
    setSelectedDate(null);
    setStartTime('09:00');
    setEndTime('10:00');
    event.target.reset();

    // Переход на страницу оплаты
    navigate('/payment');
  };

  const handleMonthChange = (event) => {
    const selectedMonth = parseInt(event.target.value);
    setMonth(selectedMonth);
  };

  const handleYearChange = (event) => {
    const selectedYear = parseInt(event.target.value);
    setYear(selectedYear);
  };

  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
  };

  const handleEndTimeChange = (event) => {
    setEndTime(event.target.value);
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
      days.push(
        <div
          key={i}
          className={`day ${selectedDate === i ? 'selected' : ''}`}
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
      <div className="left-section">
        <h2 className="aligned-header">Бронирование дат</h2>
        <div className="calendar-container">
          <div className="month-selection">
            <label>Месяц: </label>
            <select value={month} onChange={handleMonthChange}>
              {Array.from({ length: 12 }, (_, index) => (
                <option key={index} value={index}>{new Date(0, index).toLocaleString('default', { month: 'long' })}</option>
              ))}
            </select>
            <label>Год: </label>
            <select value={year} onChange={handleYearChange}>
              {Array.from({ length: 5 }, (_, index) => (
                <option key={index} value={currentDate.getFullYear() + index}>{currentDate.getFullYear() + index}</option>
              ))}
            </select>
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
              <input type="text" name="name" required />
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
              <input type="text" name="address" required />
            </div>
            <button type="submit">Забронировать</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Calendar;