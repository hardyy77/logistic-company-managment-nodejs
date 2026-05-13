const pool = require('../db');

async function getAllTrailers(status) {
  let query = `
    SELECT
      id,
      registration_number,
      trailer_type,
      capacity_kg,
      volume_m3,
      status,
      inspection_valid_until,
      created_at
    FROM trailers
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

async function getTrailerById(id) {
  const result = await pool.query(`
    SELECT
      id,
      registration_number,
      trailer_type,
      capacity_kg,
      volume_m3,
      status,
      inspection_valid_until,
      created_at
    FROM trailers
    WHERE id = $1
  `, [id]);

  return result.rows[0] || null;
}

async function createTrailer(data) {
  const {
    registrationNumber,
    trailerType,
    capacityKg,
    volumeM3,
    status,
    inspectionValidUntil,
  } = data;

  const result = await pool.query(`
    INSERT INTO trailers (
      registration_number,
      trailer_type,
      capacity_kg,
      volume_m3,
      status,
      inspection_valid_until
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING
      id,
      registration_number,
      trailer_type,
      capacity_kg,
      volume_m3,
      status,
      inspection_valid_until,
      created_at
  `, [
    registrationNumber,
    trailerType,
    capacityKg,
    volumeM3 || null,
    status || 'available',
    inspectionValidUntil || null,
  ]);

  return result.rows[0];
}

async function updateTrailer(id, data) {
  const {
    registrationNumber,
    trailerType,
    capacityKg,
    volumeM3,
    status,
    inspectionValidUntil,
  } = data;

  const result = await pool.query(`
    UPDATE trailers
    SET
      registration_number = $1,
      trailer_type = $2,
      capacity_kg = $3,
      volume_m3 = $4,
      status = $5,
      inspection_valid_until = $6
    WHERE id = $7
    RETURNING
      id,
      registration_number,
      trailer_type,
      capacity_kg,
      volume_m3,
      status,
      inspection_valid_until,
      created_at
  `, [
    registrationNumber,
    trailerType,
    capacityKg,
    volumeM3 || null,
    status,
    inspectionValidUntil || null,
    id,
  ]);

  return result.rows[0] || null;
}

async function deleteTrailer(id) {
  const result = await pool.query(`
    DELETE FROM trailers
    WHERE id = $1
    RETURNING
      id,
      registration_number,
      trailer_type
  `, [id]);

  return result.rows[0] || null;
}

module.exports = {
  getAllTrailers,
  getTrailerById,
  createTrailer,
  updateTrailer,
  deleteTrailer,
};