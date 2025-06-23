const sequelize = require('../config/database');
const { QueryTypes } = require('sequelize');

module.exports = (page) => async (req, res, next) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Не авторизован' });
  const roleId = user.roleId;
  const [access] = await sequelize.query(
    'SELECT "allowed" FROM "RolePageAccess" WHERE "roleId" = :roleId AND "page" = :page',
    { replacements: { roleId, page }, type: QueryTypes.SELECT }
  );
  if (access && access.allowed) {
    next();
  } else {
    res.status(403).json({ error: 'Нет доступа' });
  }
};
