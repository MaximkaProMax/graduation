import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [isTwoFactorRequired, setIsTwoFactorRequired] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:3001/api/users/login',
        { email, password },
        { withCredentials: true }
      );

      if (response.data.twoFactorRequired) {
        setIsTwoFactorRequired(true);
      } else {
        navigate('/manager/personal-data');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage('Пользователь не найден. Пожалуйста, зарегистрируйтесь.');
      } else {
        setErrorMessage('Произошла ошибка при попытке входа. Пожалуйста, попробуйте позже.');
      }
    }
  };

  const handleVerifyTwoFactorCode = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3001/api/users/verify-2fa-code',
        { code: twoFactorCode, email },
        { withCredentials: true }
      );
      if (response.data.success) {
        navigate('/manager/personal-data');
      } else {
        setErrorMessage('Неверный код');
      }
    } catch (error) {
      setErrorMessage('Ошибка при проверке кода');
    }
  };

  const handleRegisterClick = () => {
    navigate('/registration');
  };

  return (
    <div className="flex justify-center items-center h-[80vh] bg-gray-100">
      <div className="w-80 p-5 bg-white border border-gray-300 rounded-md shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Авторизация</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition"
          >
            Войти
          </button>
          {isTwoFactorRequired && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Код 2FA</label>
              <input
                type="text"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={handleVerifyTwoFactorCode}
                className="w-full mt-2 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Подтвердить
              </button>
            </div>
          )}
          {errorMessage && <p className="text-red-500 text-center text-sm mt-2">{errorMessage}</p>}
        </form>
        <button
          onClick={handleRegisterClick}
          className="w-full mt-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        >
          Регистрация
        </button>
        <a
          href="/reset-password"
          className="block text-center text-sm text-yellow-400 mt-4 hover:underline"
        >
          Сброс пароля
        </a>
      </div>
    </div>
  );
}

export default Login;