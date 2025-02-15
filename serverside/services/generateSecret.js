// filepath: /c:/Users/Max/Desktop/graduation/serverside/generateSecret.js
const speakeasy = require('speakeasy');

const sessionSecret = speakeasy.generateSecret({ length: 20 });
const accessTokenSecret = speakeasy.generateSecret({ length: 20 });
const twoFactorSecret = speakeasy.generateSecret({ length: 20 });

console.log('Ваш секрет для сессии (SESSION_SECRET):', sessionSecret.base32);
console.log('Ваш секрет для токена доступа (ACCESS_TOKEN_SECRET):', accessTokenSecret.base32);
console.log('Ваш секрет для двухфакторной аутентификации (TWO_FACTOR_SECRET):', twoFactorSecret.base32);