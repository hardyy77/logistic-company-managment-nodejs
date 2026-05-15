const pool = require('../db');

async function getAllPermissions() {
  const result = await pool.query(`
    SELECT
      id,
      code,
      name,
      category,
      created_at
    FROM permissions
    ORDER BY category ASC, code ASC
  `);

  return result.rows;
}

async function getPermissionsByDriverId(driverId) {
  const result = await pool.query(`
    SELECT
      p.id,
      p.code,
      p.name,
      p.category
    FROM driver_permissions dp
    JOIN permissions p ON p.id = dp.permission_id
    WHERE dp.driver_id = $1
    ORDER BY p.category ASC, p.code ASC
  `, [driverId]);

  return result.rows;
}

async function addPermissionToDriver(driverId, permissionId) {
  const result = await pool.query(`
    INSERT INTO driver_permissions (
      driver_id,
      permission_id
    )
    VALUES ($1, $2)
    ON CONFLICT (driver_id, permission_id) DO NOTHING
    RETURNING
      id,
      driver_id,
      permission_id,
      created_at
  `, [driverId, permissionId]);

  return result.rows[0] || null;
}

async function removePermissionFromDriver(driverId, permissionId) {
  const result = await pool.query(`
    DELETE FROM driver_permissions
    WHERE driver_id = $1 AND permission_id = $2
    RETURNING
      id,
      driver_id,
      permission_id
  `, [driverId, permissionId]);

  return result.rows[0] || null;
}

module.exports = {
  getAllPermissions,
  getPermissionsByDriverId,
  addPermissionToDriver,
  removePermissionFromDriver,
};