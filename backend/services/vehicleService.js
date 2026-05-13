const pool = require('../db');

async function getAllVehicles(status) {
  let query = `
    SELECT
      id,
      registration_number,
      brand,
      model,
      production_year,
      vehicle_type,
      capacity_kg,
      mileage,
      status,
      inspection_valid_until,
      insurance_valid_until,
      created_at
    FROM vehicles
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

async function getVehicleById(id) {
  const result = await pool.query(`
    SELECT
      id,
      registration_number,
      brand,
      model,
      production_year,
      vehicle_type,
      capacity_kg,
      mileage,
      status,
      inspection_valid_until,
      insurance_valid_until,
      created_at
    FROM vehicles
    WHERE id = $1
  `, [id]);

  return result.rows[0] || null;
}

async function createVehicle(data) {
  const {
    registrationNumber,
    brand,
    model,
    productionYear,
    vehicleType,
    capacityKg,
    mileage,
    status,
    inspectionValidUntil,
    insuranceValidUntil,
  } = data;

  const result = await pool.query(`
    INSERT INTO vehicles (
      registration_number,
      brand,
      model,
      production_year,
      vehicle_type,
      capacity_kg,
      mileage,
      status,
      inspection_valid_until,
      insurance_valid_until
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING
      id,
      registration_number,
      brand,
      model,
      production_year,
      vehicle_type,
      capacity_kg,
      mileage,
      status,
      inspection_valid_until,
      insurance_valid_until,
      created_at
  `, [
    registrationNumber,
    brand,
    model,
    productionYear || null,
    vehicleType,
    capacityKg,
    mileage ?? 0,
    status || 'available',
    inspectionValidUntil || null,
    insuranceValidUntil || null,
  ]);

  return result.rows[0];
}

async function updateVehicle(id, data) {
  const {
    registrationNumber,
    brand,
    model,
    productionYear,
    vehicleType,
    capacityKg,
    mileage,
    status,
    inspectionValidUntil,
    insuranceValidUntil,
  } = data;

  const result = await pool.query(`
    UPDATE vehicles
    SET
      registration_number = $1,
      brand = $2,
      model = $3,
      production_year = $4,
      vehicle_type = $5,
      capacity_kg = $6,
      mileage = $7,
      status = $8,
      inspection_valid_until = $9,
      insurance_valid_until = $10
    WHERE id = $11
    RETURNING
      id,
      registration_number,
      brand,
      model,
      production_year,
      vehicle_type,
      capacity_kg,
      mileage,
      status,
      inspection_valid_until,
      insurance_valid_until,
      created_at
  `, [
    registrationNumber,
    brand,
    model,
    productionYear || null,
    vehicleType,
    capacityKg,
    mileage ?? 0,
    status,
    inspectionValidUntil || null,
    insuranceValidUntil || null,
    id,
  ]);

  return result.rows[0] || null;
}

async function deleteVehicle(id) {
  const result = await pool.query(`
    DELETE FROM vehicles
    WHERE id = $1
    RETURNING
      id,
      registration_number,
      brand,
      model
  `, [id]);

  return result.rows[0] || null;
}

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};