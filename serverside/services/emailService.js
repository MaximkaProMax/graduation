// filepath: /c:/Users/Max/Desktop/graduation/serverside/services/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config({ path: './services/.env' });

const transporter = nodemailer.createTransport({
  service: 'yandex',
  auth: {
    user: process.env.YANDEX_USER,
    pass: process.env.YANDEX_PASS,
  },
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.YANDEX_USER,
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = (to, resetLink) => {
  const mailOptions = {
    from: process.env.YANDEX_USER,
    to,
    subject: 'Сброс пароля',
    text: `Для сброса пароля перейдите по ссылке: ${resetLink}`,
  };

  console.log('Отправка письма на адрес:', to);

  return transporter.sendMail(mailOptions)
    .then(() => console.log('Письмо успешно отправлено'))
    .catch((error) => {
      console.error('Ошибка при отправке письма:', error);
      throw error;
    });
};

module.exports = { sendEmail, sendPasswordResetEmail };