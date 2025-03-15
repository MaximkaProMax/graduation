import React from 'react';
import './Reviews.css';

const Reviews = () => {
  const reviews = [
    {
      user: 'Максим',
      rating: '10/10',
      review: 'Хороший сервис',
      studio: 'Зал Cozy',
      typography: 'FlexBind',
    },
    {
      user: 'Мария',
      rating: '10/10',
      review: 'Мне понравилось',
      studio: 'Зал Garden',
      typography: 'LayFlat',
    },
    {
      user: 'Сергей',
      rating: '10/10',
      review: 'Все супер',
      studio: 'Зал Replace',
      typography: 'FlexBind',
    },
  ];

  return (
    <div className="reviews-container">
      <h2>Отзывы о нашем сервисе</h2>
      <table>
        <thead>
          <tr>
            <th>Пользователь</th>
            <th>Оценка</th>
            <th>Отзыв</th>
            <th>Студия</th>
            <th>Типография</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review, index) => (
            <tr key={index}>
              <td>{review.user}</td>
              <td>{review.rating}</td>
              <td>{review.review}</td>
              <td>{review.studio}</td>
              <td>{review.typography}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reviews;