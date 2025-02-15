// filepath: /c:/Users/Max/Desktop/graduation/serverside/services/twoFactorAuth.js
const speakeasy = require('speakeasy');
require('dotenv').config({ path: './services/.env' });

const generateTwoFactorCode = () => {
  return speakeasy.totp({
    secret: process.env.TWO_FACTOR_SECRET,
    encoding: 'base32',
  });
};

const verifyTwoFactorCode = (token) => {
  return speakeasy.totp.verify({
    secret: process.env.TWO_FACTOR_SECRET,
    encoding: 'base32',
    token,
    window: 1,
  });
};

module.exports = { generateTwoFactorCode, verifyTwoFactorCode };