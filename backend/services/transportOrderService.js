const pool = require('../db');

async function getAllTransportOrders(status) {
  let query = `
    SELECT
      transport_orders.id,
      transport_orders.order_number,
      transport_orders.client_name,
      transport_orders.pickup_location,
      transport_orders.delivery_location,
      transport_orders.cargo_weight_kg,
      transport_orders.cargo_type,
      transport_orders.planned_distance_km,
      transport_orders.planned_duration_minutes,
      transport_orders.estimated_cost,
      transport_orders.planned_date,
      transport_orders.status,
      transport_orders.driver_id,
      transport_orders.vehicle_id,
      transport_orders.trailer_id,
      transport_orders.created_by_user_id,
      transport_orders.created_at
    FROM transport_orders
  `;

  const params = [];

  if (status) {
    query += ` WHERE transport_orders.status = $1`;
    params.push(status);
  }

  query += ` ORDER BY transport_orders.id ASC`;

  const result = await pool.query(query, params);
  return result.rows;
}

async function getTransportOrderById(id) {
  const result = await pool.query(`
    SELECT
      transport_orders.id,
      transport_orders.order_number,
      transport_orders.client_name,
      transport_orders.pickup_location,
      transport_orders.delivery_location,
      transport_orders.cargo_weight_kg,
      transport_orders.cargo_type,
      transport_orders.planned_distance_km,
      transport_orders.planned_duration_minutes,
      transport_orders.estimated_cost,
      transport_orders.planned_date,
      transport_orders.status,
      transport_orders.driver_id,
      transport_orders.vehicle_id,
      transport_orders.trailer_id,
      transport_orders.created_by_user_id,
      transport_orders.created_at
    FROM transport_orders
    WHERE transport_orders.id = $1
  `, [id]);

  return result.rows[0] || null;
}

async function getDriverById(id) {
  const result = await pool.query(`
    SELECT id, status
    FROM drivers
    WHERE id = $1
  `, [id]);

  return result.rows[0] || null;
}

async function getVehicleById(id) {
  const result = await pool.query(`
    SELECT id, status, capacity_kg, inspection_valid_until
    FROM vehicles
    WHERE id = $1
  `, [id]);

  return result.rows[0] || null;
}

async function getTrailerById(id) {
  const result = await pool.query(`
    SELECT id, status, capacity_kg, inspection_valid_until, trailer_type
    FROM trailers
    WHERE id = $1
  `, [id]);

  return result.rows[0] || null;
}

function validateInspectionDate(inspectionValidUntil) {
  if (!inspectionValidUntil) {
    return false;
  }

  const inspectionDate = new Date(inspectionValidUntil);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return inspectionDate >= today;
}

function isTrailerCompatibleWithCargo(trailerType, cargoType) {
  if (!cargoType) {
    return true;
  }

  const normalizedCargoType = String(cargoType).trim().toLowerCase();
  const normalizedTrailerType = String(trailerType).trim().toLowerCase();

  const compatibilityMap = {
    curtain: ['general', 'electronics', 'parcel', 'pallet'],
    box: ['general', 'electronics', 'parcel', 'pallet'],
    refrigerated: ['food', 'frozen', 'pharma'],
    tanker: ['liquid', 'fuel', 'chemical'],
    dump: ['bulk', 'aggregate', 'construction'],
    container: ['containerized'],
  };

  const allowedCargoTypes = compatibilityMap[normalizedTrailerType];

  if (!allowedCargoTypes) {
    return false;
  }

  return allowedCargoTypes.includes(normalizedCargoType);
}

async function validateBusinessRules({ driverId, vehicleId, trailerId, cargoWeightKg, cargoType }) {
  let vehicle = null;

  if (driverId) {
    const driver = await getDriverById(driverId);

    if (!driver) {
      return { ok: false, message: 'Wybrany kierowca nie istnieje' };
    }

    if (driver.status !== 'active') {
      return { ok: false, message: 'Wybrany kierowca nie jest dostępny do realizacji zlecenia' };
    }
  }

  if (vehicleId) {
    vehicle = await getVehicleById(vehicleId);

    if (!vehicle) {
      return { ok: false, message: 'Wybrany pojazd nie istnieje' };
    }

    if (vehicle.status !== 'available') {
      return { ok: false, message: 'Wybrany pojazd nie jest dostępny do realizacji zlecenia' };
    }

    if (!validateInspectionDate(vehicle.inspection_valid_until)) {
      return { ok: false, message: 'Wybrany pojazd ma nieważny termin przeglądu' };
    }
  }

  if (trailerId) {
    const trailer = await getTrailerById(trailerId);

    if (!trailer) {
      return { ok: false, message: 'Wybrana naczepa nie istnieje' };
    }

    if (trailer.status !== 'available') {
      return { ok: false, message: 'Wybrana naczepa nie jest dostępna do realizacji zlecenia' };
    }

    if (!validateInspectionDate(trailer.inspection_valid_until)) {
      return { ok: false, message: 'Wybrana naczepa ma nieważny termin przeglądu' };
    }

    if (Number(trailer.capacity_kg) < Number(cargoWeightKg)) {
      return { ok: false, message: 'Ładowność naczepy jest niewystarczająca dla tego zlecenia' };
    }

    if (!isTrailerCompatibleWithCargo(trailer.trailer_type, cargoType)) {
      return {
        ok: false,
        message: `Typ naczepy "${trailer.trailer_type}" nie pasuje do ładunku "${cargoType}"`,
      };
    }
  } else if (vehicleId) {
    if (Number(vehicle.capacity_kg) < Number(cargoWeightKg)) {
      return { ok: false, message: 'Ładowność pojazdu jest niewystarczająca dla tego zlecenia' };
    }
  }

  return { ok: true };
}

async function createTransportOrder(data) {
  const {
    orderNumber,
    clientName,
    pickupLocation,
    deliveryLocation,
    cargoWeightKg,
    cargoType,
    plannedDistanceKm,
    plannedDurationMinutes,
    estimatedCost,
    plannedDate,
    status,
    driverId,
    vehicleId,
    trailerId,
    createdByUserId,
  } = data;

  const validation = await validateBusinessRules({
    driverId,
    vehicleId,
    trailerId,
    cargoWeightKg,
    cargoType,
  });

  if (!validation.ok) {
    return {
      error: validation.message,
      statusCode: 400,
    };
  }

  const result = await pool.query(`
    INSERT INTO transport_orders (
      order_number,
      client_name,
      pickup_location,
      delivery_location,
      cargo_weight_kg,
      cargo_type,
      planned_distance_km,
      planned_duration_minutes,
      estimated_cost,
      planned_date,
      status,
      driver_id,
      vehicle_id,
      trailer_id,
      created_by_user_id
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING
      id,
      order_number,
      client_name,
      pickup_location,
      delivery_location,
      cargo_weight_kg,
      cargo_type,
      planned_distance_km,
      planned_duration_minutes,
      estimated_cost,
      planned_date,
      status,
      driver_id,
      vehicle_id,
      trailer_id,
      created_by_user_id,
      created_at
  `, [
    orderNumber,
    clientName,
    pickupLocation,
    deliveryLocation,
    cargoWeightKg,
    cargoType || null,
    plannedDistanceKm || null,
    plannedDurationMinutes || null,
    estimatedCost || null,
    plannedDate,
    status || 'new',
    driverId || null,
    vehicleId || null,
    trailerId || null,
    createdByUserId || null,
  ]);

  return result.rows[0];
}

async function updateTransportOrder(id, data) {
  const {
    orderNumber,
    clientName,
    pickupLocation,
    deliveryLocation,
    cargoWeightKg,
    cargoType,
    plannedDistanceKm,
    plannedDurationMinutes,
    estimatedCost,
    plannedDate,
    status,
    driverId,
    vehicleId,
    trailerId,
    createdByUserId,
  } = data;

  const existingOrder = await getTransportOrderById(id);

  if (!existingOrder) {
    return null;
  }

  const validation = await validateBusinessRules({
    driverId,
    vehicleId,
    trailerId,
    cargoWeightKg,
    cargoType,
  });

  if (!validation.ok) {
    return {
      error: validation.message,
      statusCode: 400,
    };
  }

  const result = await pool.query(`
    UPDATE transport_orders
    SET
      order_number = $1,
      client_name = $2,
      pickup_location = $3,
      delivery_location = $4,
      cargo_weight_kg = $5,
      cargo_type = $6,
      planned_distance_km = $7,
      planned_duration_minutes = $8,
      estimated_cost = $9,
      planned_date = $10,
      status = $11,
      driver_id = $12,
      vehicle_id = $13,
      trailer_id = $14,
      created_by_user_id = $15
    WHERE id = $16
    RETURNING
      id,
      order_number,
      client_name,
      pickup_location,
      delivery_location,
      cargo_weight_kg,
      cargo_type,
      planned_distance_km,
      planned_duration_minutes,
      estimated_cost,
      planned_date,
      status,
      driver_id,
      vehicle_id,
      trailer_id,
      created_by_user_id,
      created_at
  `, [
    orderNumber,
    clientName,
    pickupLocation,
    deliveryLocation,
    cargoWeightKg,
    cargoType || null,
    plannedDistanceKm || null,
    plannedDurationMinutes || null,
    estimatedCost || null,
    plannedDate,
    status,
    driverId || null,
    vehicleId || null,
    trailerId || null,
    createdByUserId || null,
    id,
  ]);

  return result.rows[0] || null;
}

async function deleteTransportOrder(id) {
  const result = await pool.query(`
    DELETE FROM transport_orders
    WHERE id = $1
    RETURNING
      id,
      order_number,
      client_name
  `, [id]);

  return result.rows[0] || null;
}

module.exports = {
  getAllTransportOrders,
  getTransportOrderById,
  createTransportOrder,
  updateTransportOrder,
  deleteTransportOrder,
};