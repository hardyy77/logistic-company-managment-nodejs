const bcrypt = require('bcrypt');
const pool = require('../db');

function generateTemporaryPassword(length = 10) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
  let password = '';

  for (let i = 0; i < length; i += 1) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return password;
}

async function getDriverRoleId(client) {
  const result = await client.query(
    `SELECT id FROM roles WHERE name = 'driver' LIMIT 1`
  );

  return result.rows[0]?.id || null;
}

async function getAllDrivers(status) {
  let query = `
    SELECT
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
    FROM drivers
  `;

  const params = [];

  if (status) {
    query += ` WHERE status = $1`;
    params.push(status);
  }

  query += ` ORDER BY id ASC`;

  const result = await pool.query(query, params);
  return result.rows;
}

async function getDriverById(id) {
  const result = await pool.query(`
    SELECT
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
    FROM drivers
    WHERE id = $1
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
    createUserAccount,
  } = data;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    let createdUserId = null;
    let createdAccount = null;

    if (createUserAccount) {
      if (!email) {
        await client.query('ROLLBACK');
        return {
          error: 'Aby utworzyć konto kierowcy, email jest wymagany',
          statusCode: 400,
        };
      }

      const existingUser = await client.query(
        `SELECT id FROM users WHERE email = $1 LIMIT 1`,
        [email]
      );

      if (existingUser.rows.length > 0) {
        await client.query('ROLLBACK');
        return {
          error: 'Użytkownik z takim emailem już istnieje',
          statusCode: 400,
        };
      }

      const driverRoleId = await getDriverRoleId(client);

      if (!driverRoleId) {
        await client.query('ROLLBACK');
        return {
          error: 'Nie znaleziono roli driver w tabeli roles',
          statusCode: 500,
        };
      }

      const temporaryPassword = generateTemporaryPassword();
      const passwordHash = await bcrypt.hash(temporaryPassword, 10);

      const createdUserResult = await client.query(`
        INSERT INTO users (
          first_name,
          last_name,
          email,
          password_hash,
          role_id,
          is_active
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, email
      `, [
        firstName,
        lastName,
        email,
        passwordHash,
        driverRoleId,
        true,
      ]);

      createdUserId = createdUserResult.rows[0].id;
      createdAccount = {
        email: createdUserResult.rows[0].email,
        temporaryPassword,
      };
    }

    const result = await client.query(`
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
      status || 'available',
      createdUserId,
    ]);

    await client.query('COMMIT');

    return {
      driver: result.rows[0],
      createdAccount,
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
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
      status = $8
    WHERE id = $9
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
      last_name
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