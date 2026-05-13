const pool = require('../db');

async function getAllUsers() {
  const result = await pool.query(`
    SELECT 
      users.id,
      users.first_name,
      users.last_name,
      users.email,
      users.is_active,
      users.created_at,
      roles.name AS role
    FROM users
    LEFT JOIN roles ON users.role_id = roles.id
    ORDER BY users.id ASC
  `);

  return result.rows;
}

async function getUserById(id) {
  const result = await pool.query(`
    SELECT 
      users.id,
      users.first_name,
      users.last_name,
      users.email,
      users.is_active,
      users.created_at,
      roles.name AS role
    FROM users
    LEFT JOIN roles ON users.role_id = roles.id
    WHERE users.id = $1
  `, [id]);

  return result.rows[0] || null;
}

async function updateUser(id, data) {
  const { firstName, lastName, email, roleId, isActive } = data;

  const result = await pool.query(`
    UPDATE users
    SET
      first_name = $1,
      last_name = $2,
      email = $3,
      role_id = $4,
      is_active = $5
    WHERE id = $6
    RETURNING id, first_name, last_name, email, role_id, is_active, created_at
  `, [firstName, lastName, email, roleId, isActive, id]);

  return result.rows[0] || null;
}

async function deleteUser(id) {
  const result = await pool.query(
    'DELETE FROM users WHERE id = $1 RETURNING id, first_name, last_name, email',
    [id]
  );

  return result.rows[0] || null;
}

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};