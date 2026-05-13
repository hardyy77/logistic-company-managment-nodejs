const pool = require('../db');

async function getAllDrivers() {
  const result = await pool.query(`
    SELECT
      drivers.id,
      drivers.first_name,
      drivers.last_name,
      drivers.phone,
      drivers.email,
      drivers.license_number,
      drivers.license_category,
      drivers.medical_exam_valid_until,
      drivers.status,
      drivers.user_id,
      drivers.created_at
    FROM drivers
    ORDER BY drivers.id ASC
  `);

  return result.rows;
}

async function getDriverById(id) {
  const result = await pool.query(`
    SELECT
      drivers.id,
      drivers.first_name,
      drivers.last_name,
      drivers.phone,
      drivers.email,
      drivers.license_number,
      drivers.license_category,
      drivers.medical_exam_valid_until,
      drivers.status,
      drivers.user_id,
      drivers.created_at
    FROM drivers
    WHERE drivers.id = $1
  `, [id]);

  return result.rows[0] || null;
}

async function createDriver(data) {
  const {
    firstName,
    lastName,
    phone,
    email,
    licenseNumber,
    licenseCategory,
    medicalExamValidUntil,
    status,
    userId,
  } = data;

  const result = await pool.query(`
    INSERT INTO drivers (
      first_name,
      last_name,
      phone,
      email,
      license_number,
      license_category,
      medical_exam_valid_until,
      status,
      user_id
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING
      id,
      first_name,
      last_name,
      phone,
      email,
      license_number,
      license_category,
      medical_exam_valid_until,
      status,
      user_id,
      created_at
  `, [
    firstName,
    lastName,
    phone || null,
    email || null,
    licenseNumber,
    licenseCategory,
    medicalExamValidUntil || null,
    status || 'active',
    userId || null,
  ]);

  return result.rows[0];
}

async function updateDriver(id, data) {
  const {
    firstName,
    lastName,
    phone,
    email,
    licenseNumber,
    licenseCategory,
    medicalExamValidUntil,
    status,
    userId,
  } = data;

  const result = await pool.query(`
    UPDATE drivers
    SET
      first_name = $1,
      last_name = $2,
      phone = $3,
      email = $4,
      license_number = $5,
      license_category = $6,
      medical_exam_valid_until = $7,
      status = $8,
      user_id = $9
    WHERE id = $10
    RETURNING
      id,
      first_name,
      last_name,
      phone,
      email,
      license_number,
      license_category,
      medical_exam_valid_until,
      status,
      user_id,
      created_at
  `, [
    firstName,
    lastName,
    phone || null,
    email || null,
    licenseNumber,
    licenseCategory,
    medicalExamValidUntil || null,
    status,
    userId || null,
    id,
  ]);

  return result.rows[0] || null;
}

async function deleteDriver(id) {
  const result = await pool.query(`
    DELETE FROM drivers
    WHERE id = $1
    RETURNING
      id,
      first_name,
      last_name,
      email
  `, [id]);

  return result.rows[0] || null;
}

module.exports = {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
};