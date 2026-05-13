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

module.exports = {
  findUserByEmail,
  getRoleByName,
  createUser,
};