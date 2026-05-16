const bcrypt = require('bcrypt');
const pool = require('../db');

async function findUserByEmail(email) {
  const result = await pool.query(
    `SELECT 
        users.id,
        users.first_name,
        users.last_name,
        users.email,
        users.password_hash,
        users.role_id,
        users.is_active,
        roles.name AS role_name
     FROM users
     LEFT JOIN roles ON users.role_id = roles.id
     WHERE users.email = $1`,
    [email]
  );

  return result.rows[0] || null;
}

async function getRoleByName(roleName) {
  const result = await pool.query(
    'SELECT * FROM roles WHERE name = $1',
    [roleName]
  );

  return result.rows[0] || null;
}

async function createUser({ firstName, lastName, email, passwordHash, roleId }) {
  const result = await pool.query(
    `INSERT INTO users (first_name, last_name, email, password_hash, role_id, is_active)
     VALUES ($1, $2, $3, $4, $5, TRUE)
     RETURNING id, first_name, last_name, email, role_id, is_active, created_at`,
    [firstName, lastName, email, passwordHash, roleId]
  );

  return result.rows[0];
}

async function changePassword(userId, oldPassword, newPassword) {
  const result = await pool.query(
    `SELECT id, password_hash, is_active
     FROM users
     WHERE id = $1`,
    [userId]
  );

  const user = result.rows[0];

  if (!user) {
    return {
      error: 'Użytkownik nie został znaleziony',
      statusCode: 404,
    };
  }

  if (!user.is_active) {
    return {
      error: 'Konto użytkownika jest nieaktywne',
      statusCode: 403,
    };
  }

  const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);

  if (!isOldPasswordValid) {
    return {
      error: 'Obecne hasło jest nieprawidłowe',
      statusCode: 401,
    };
  }

  const newPasswordHash = await bcrypt.hash(newPassword, 10);

  await pool.query(
    `UPDATE users
     SET password_hash = $1
     WHERE id = $2`,
    [newPasswordHash, userId]
  );

  return { success: true };
}

module.exports = {
  findUserByEmail,
  getRoleByName,
  createUser,
  changePassword,
};