const pool = require('../db');

const RESERVED_ORDER_STATUSES = ['planned', 'in_progress'];
const RELEASING_ORDER_STATUSES = ['completed', 'cancelled'];

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
      transport_orders.cargo_name,
      transport_orders.planned_distance_km,
      transport_orders.planned_duration_minutes,
      transport_orders.estimated_cost,
      transport_orders.planned_date,
      transport_orders.status,
      transport_orders.driver_id,
      transport_orders.vehicle_id,
      transport_orders.trailer_id,
      transport_orders.created_by_user_id,
      transport_orders.created_at,
      drivers.first_name AS driver_first_name,
      drivers.last_name AS driver_last_name,
      vehicles.registration_number AS vehicle_registration_number,
      trailers.registration_number AS trailer_registration_number,
      trailers.trailer_type AS trailer_type
    FROM transport_orders
    LEFT JOIN drivers ON drivers.id = transport_orders.driver_id
    LEFT JOIN vehicles ON vehicles.id = transport_orders.vehicle_id
    LEFT JOIN trailers ON trailers.id = transport_orders.trailer_id
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
      transport_orders.cargo_name,
      transport_orders.planned_distance_km,
      transport_orders.planned_duration_minutes,
      transport_orders.estimated_cost,
      transport_orders.planned_date,
      transport_orders.status,
      transport_orders.driver_id,
      transport_orders.vehicle_id,
      transport_orders.trailer_id,
      transport_orders.created_by_user_id,
      transport_orders.created_at,
      drivers.first_name AS driver_first_name,
      drivers.last_name AS driver_last_name,
      vehicles.registration_number AS vehicle_registration_number,
      trailers.registration_number AS trailer_registration_number,
      trailers.trailer_type AS trailer_type
    FROM transport_orders
    LEFT JOIN drivers ON drivers.id = transport_orders.driver_id
    LEFT JOIN vehicles ON vehicles.id = transport_orders.vehicle_id
    LEFT JOIN trailers ON trailers.id = transport_orders.trailer_id
    WHERE transport_orders.id = $1
  `, [id]);

  return result.rows[0] || null;
}

async function getDriverById(id) {
  const result = await pool.query(`
    SELECT
      d.id,
      d.status,
      d.license_category,
      COALESCE(
        ARRAY_AGG(p.code ORDER BY p.code)
        FILTER (WHERE p.code IS NOT NULL),
        '{}'
      ) AS permissions
    FROM drivers d
    LEFT JOIN driver_permissions dp ON dp.driver_id = d.id
    LEFT JOIN permissions p ON p.id = dp.permission_id
    WHERE d.id = $1
    GROUP BY d.id, d.status, d.license_category
  `, [id]);

  return result.rows[0] || null;
}

async function getVehicleById(id) {
  const result = await pool.query(`
    SELECT
      id,
      status,
      capacity_kg,
      inspection_valid_until,
      vehicle_type,
      registration_number
    FROM vehicles
    WHERE id = $1
  `, [id]);

  return result.rows[0] || null;
}

async function getTrailerById(id) {
  const result = await pool.query(`
    SELECT
      id,
      status,
      capacity_kg,
      inspection_valid_until,
      trailer_type,
      registration_number
    FROM trailers
    WHERE id = $1
  `, [id]);

  return result.rows[0] || null;
}

async function getReservedResourceIds(excludeOrderId = null, client = pool) {
  const params = [RESERVED_ORDER_STATUSES];
  let query = `
    SELECT
      driver_id,
      vehicle_id,
      trailer_id
    FROM transport_orders
    WHERE status = ANY($1)
  `;

  if (excludeOrderId) {
    query += ` AND id <> $2`;
    params.push(excludeOrderId);
  }

  const result = await client.query(query, params);

  const reservedDriverIds = new Set();
  const reservedVehicleIds = new Set();
  const reservedTrailerIds = new Set();

  for (const row of result.rows) {
    if (row.driver_id) reservedDriverIds.add(Number(row.driver_id));
    if (row.vehicle_id) reservedVehicleIds.add(Number(row.vehicle_id));
    if (row.trailer_id) reservedTrailerIds.add(Number(row.trailer_id));
  }

  return {
    reservedDriverIds,
    reservedVehicleIds,
    reservedTrailerIds,
  };
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

function getRequiredPermissionCodes({ trailerType, cargoType }) {
  const required = ['C_E'];

  const normalizedTrailerType = trailerType ? String(trailerType).trim().toLowerCase() : '';
  const normalizedCargoType = cargoType ? String(cargoType).trim().toLowerCase() : '';

  const trailerPermissionMap = {
    curtain: 'CURTAIN',
    box: 'BOX',
    refrigerated: 'REFRIGERATED',
    tanker: 'TANKER',
    container: 'CONTAINER',
    dump: 'DUMP',
  };

  const trailerPermission = trailerPermissionMap[normalizedTrailerType];
  if (trailerPermission) {
    required.push(trailerPermission);
  }

  if (['fuel', 'chemical'].includes(normalizedCargoType)) {
    required.push('ADR');
  }

  return [...new Set(required)];
}

async function generateNextOrderNumber() {
  const year = new Date().getFullYear();
  const prefix = `ZT-${year}-`;

  const result = await pool.query(`
    SELECT order_number
    FROM transport_orders
    WHERE order_number LIKE $1
    ORDER BY id DESC
    LIMIT 1
  `, [`${prefix}%`]);

  if (result.rows.length === 0) {
    return `${prefix}001`;
  }

  const lastOrderNumber = result.rows[0].order_number;
  const lastSequence = Number(lastOrderNumber.split('-').pop()) || 0;
  const nextSequence = String(lastSequence + 1).padStart(3, '0');

  return `${prefix}${nextSequence}`;
}

async function validateBusinessRules({
  orderId = null,
  driverId,
  vehicleId,
  trailerId,
  cargoWeightKg,
  cargoType,
}, client = pool) {
  let vehicle = null;
  const {
    reservedDriverIds,
    reservedVehicleIds,
    reservedTrailerIds,
  } = await getReservedResourceIds(orderId, client);

  if (driverId) {
    const driver = await getDriverById(driverId);

    if (!driver) {
      return { ok: false, message: 'Wybrany kierowca nie istnieje' };
    }

    if (driver.status !== 'available') {
      return { ok: false, message: 'Wybrany kierowca nie jest dostępny do realizacji zlecenia' };
    }

    if (reservedDriverIds.has(Number(driverId))) {
      return { ok: false, message: 'Wybrany kierowca jest już przypisany do innego aktywnego zlecenia' };
    }

    const trailer = trailerId ? await getTrailerById(trailerId) : null;
    const requiredPermissionCodes = getRequiredPermissionCodes({
      trailerType: trailer?.trailer_type,
      cargoType,
    });

    const driverPermissions = driver.permissions || [];
    const hasAllRequiredPermissions = requiredPermissionCodes.every((code) =>
      driverPermissions.includes(code)
    );

    if (!hasAllRequiredPermissions) {
      return {
        ok: false,
        message: 'Wybrany kierowca nie ma wymaganych uprawnień do realizacji tego zlecenia',
      };
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

    if (reservedVehicleIds.has(Number(vehicleId))) {
      return { ok: false, message: 'Wybrany pojazd jest już przypisany do innego aktywnego zlecenia' };
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

    if (reservedTrailerIds.has(Number(trailerId))) {
      return { ok: false, message: 'Wybrana naczepa jest już przypisana do innego aktywnego zlecenia' };
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

async function getAvailableResources({ cargoType, cargoWeightKg, excludeOrderId = null }) {
  const normalizedWeight = Number(cargoWeightKg) || 0;
  const {
    reservedDriverIds,
    reservedVehicleIds,
    reservedTrailerIds,
  } = await getReservedResourceIds(excludeOrderId);

  const vehiclesResult = await pool.query(`
    SELECT
      id,
      registration_number,
      brand,
      model,
      vehicle_type,
      capacity_kg,
      status
    FROM vehicles
    WHERE status = 'available'
    ORDER BY registration_number ASC
  `);

  const trailersResult = await pool.query(`
    SELECT
      id,
      registration_number,
      trailer_type,
      capacity_kg,
      status
    FROM trailers
    WHERE status = 'available'
    ORDER BY registration_number ASC
  `);

  const compatibleTrailers = trailersResult.rows.filter((trailer) => {
    const enoughCapacity = Number(trailer.capacity_kg) >= normalizedWeight;
    const compatibleType = isTrailerCompatibleWithCargo(trailer.trailer_type, cargoType);
    const notReserved = !reservedTrailerIds.has(Number(trailer.id));
    return enoughCapacity && compatibleType && notReserved;
  });

  const driversResult = await pool.query(`
    SELECT
      d.id,
      d.first_name,
      d.last_name,
      d.license_category,
      d.status,
      COALESCE(
        ARRAY_AGG(p.code ORDER BY p.code)
        FILTER (WHERE p.code IS NOT NULL),
        '{}'
      ) AS permissions
    FROM drivers d
    LEFT JOIN driver_permissions dp ON dp.driver_id = d.id
    LEFT JOIN permissions p ON p.id = dp.permission_id
    WHERE d.status = 'available'
    GROUP BY d.id, d.first_name, d.last_name, d.license_category, d.status
    ORDER BY d.last_name ASC, d.first_name ASC
  `);

  const requiredPermissionSets = compatibleTrailers.map((trailer) =>
    getRequiredPermissionCodes({
      trailerType: trailer.trailer_type,
      cargoType,
    })
  );

  const compatibleDrivers = driversResult.rows.filter((driver) => {
    const permissions = driver.permissions || [];
    const notReserved = !reservedDriverIds.has(Number(driver.id));

    if (!notReserved) {
      return false;
    }

    if (requiredPermissionSets.length === 0) {
      return permissions.includes('C_E');
    }

    return requiredPermissionSets.some((requiredSet) =>
      requiredSet.every((code) => permissions.includes(code))
    );
  });

  const compatibleVehicles = vehiclesResult.rows.filter((vehicle) => {
    const notReserved = !reservedVehicleIds.has(Number(vehicle.id));
    return notReserved && (compatibleTrailers.length > 0 || Number(vehicle.capacity_kg) >= normalizedWeight);
  });

  return {
    drivers: compatibleDrivers,
    vehicles: compatibleVehicles,
    trailers: compatibleTrailers,
    requiredPermissionSets,
  };
}

async function setDriverStatus(driverId, status, client) {
  if (!driverId) return;
  await client.query(`
    UPDATE drivers
    SET status = $1
    WHERE id = $2
  `, [status, driverId]);
}

async function setVehicleStatus(vehicleId, status, client) {
  if (!vehicleId) return;
  await client.query(`
    UPDATE vehicles
    SET status = $1
    WHERE id = $2
  `, [status, vehicleId]);
}

async function setTrailerStatus(trailerId, status, client) {
  if (!trailerId) return;
  await client.query(`
    UPDATE trailers
    SET status = $1
    WHERE id = $2
  `, [status, trailerId]);
}

async function syncStatusesForOrderTransition(previousOrder, nextOrder, client) {
  const previousStatus = previousOrder?.status || null;
  const nextStatus = nextOrder?.status || null;

  const wasReserved = RESERVED_ORDER_STATUSES.includes(previousStatus);
  const isReserved = RESERVED_ORDER_STATUSES.includes(nextStatus);
  const isReleasing = RELEASING_ORDER_STATUSES.includes(nextStatus);

  if (!wasReserved && isReserved) {
    await setDriverStatus(nextOrder.driver_id, 'in_route', client);
    await setVehicleStatus(nextOrder.vehicle_id, 'in_use', client);
    await setTrailerStatus(nextOrder.trailer_id, 'in_use', client);
    return;
  }

  if (wasReserved && isReleasing) {
    await setDriverStatus(previousOrder.driver_id, 'available', client);
    await setVehicleStatus(previousOrder.vehicle_id, 'available', client);
    await setTrailerStatus(previousOrder.trailer_id, 'available', client);
    return;
  }

  if (wasReserved && isReserved) {
    const driverChanged = Number(previousOrder.driver_id || 0) !== Number(nextOrder.driver_id || 0);
    const vehicleChanged = Number(previousOrder.vehicle_id || 0) !== Number(nextOrder.vehicle_id || 0);
    const trailerChanged = Number(previousOrder.trailer_id || 0) !== Number(nextOrder.trailer_id || 0);

    if (driverChanged) {
      await setDriverStatus(previousOrder.driver_id, 'available', client);
      await setDriverStatus(nextOrder.driver_id, 'in_route', client);
    }

    if (vehicleChanged) {
      await setVehicleStatus(previousOrder.vehicle_id, 'available', client);
      await setVehicleStatus(nextOrder.vehicle_id, 'in_use', client);
    }

    if (trailerChanged) {
      await setTrailerStatus(previousOrder.trailer_id, 'available', client);
      await setTrailerStatus(nextOrder.trailer_id, 'in_use', client);
    }
  }
}

async function createTransportOrder(data) {
  const {
    orderNumber,
    clientName,
    pickupLocation,
    deliveryLocation,
    cargoWeightKg,
    cargoType,
    cargoName,
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

  const finalOrderNumber = orderNumber || await generateNextOrderNumber();

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const validation = await validateBusinessRules({
      driverId,
      vehicleId,
      trailerId,
      cargoWeightKg,
      cargoType,
    }, client);

    if (!validation.ok) {
      await client.query('ROLLBACK');
      return {
        error: validation.message,
        statusCode: 400,
      };
    }

    const result = await client.query(`
      INSERT INTO transport_orders (
        order_number,
        client_name,
        pickup_location,
        delivery_location,
        cargo_weight_kg,
        cargo_type,
        cargo_name,
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
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING
        id,
        order_number,
        client_name,
        pickup_location,
        delivery_location,
        cargo_weight_kg,
        cargo_type,
        cargo_name,
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
      finalOrderNumber,
      clientName,
      pickupLocation,
      deliveryLocation,
      cargoWeightKg,
      cargoType || null,
      cargoName || null,
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

    const createdOrder = result.rows[0];

    await syncStatusesForOrderTransition(null, createdOrder, client);

    await client.query('COMMIT');
    return createdOrder;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function updateTransportOrder(id, data) {
  const {
    orderNumber,
    clientName,
    pickupLocation,
    deliveryLocation,
    cargoWeightKg,
    cargoType,
    cargoName,
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

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const validation = await validateBusinessRules({
      orderId: id,
      driverId,
      vehicleId,
      trailerId,
      cargoWeightKg,
      cargoType,
    }, client);

    if (!validation.ok) {
      await client.query('ROLLBACK');
      return {
        error: validation.message,
        statusCode: 400,
      };
    }

    const result = await client.query(`
      UPDATE transport_orders
      SET
        order_number = $1,
        client_name = $2,
        pickup_location = $3,
        delivery_location = $4,
        cargo_weight_kg = $5,
        cargo_type = $6,
        cargo_name = $7,
        planned_distance_km = $8,
        planned_duration_minutes = $9,
        estimated_cost = $10,
        planned_date = $11,
        status = $12,
        driver_id = $13,
        vehicle_id = $14,
        trailer_id = $15,
        created_by_user_id = $16
      WHERE id = $17
      RETURNING
        id,
        order_number,
        client_name,
        pickup_location,
        delivery_location,
        cargo_weight_kg,
        cargo_type,
        cargo_name,
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
      cargoName || null,
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

    const updatedOrder = result.rows[0];

    await syncStatusesForOrderTransition(existingOrder, updatedOrder, client);

    await client.query('COMMIT');
    return updatedOrder;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function deleteTransportOrder(id) {
  const existingOrder = await getTransportOrderById(id);
  if (!existingOrder) {
    return null;
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const result = await client.query(`
      DELETE FROM transport_orders
      WHERE id = $1
      RETURNING
        id,
        order_number,
        client_name,
        status,
        driver_id,
        vehicle_id,
        trailer_id
    `, [id]);

    const deletedOrder = result.rows[0] || null;

    if (deletedOrder && RESERVED_ORDER_STATUSES.includes(existingOrder.status)) {
      await setDriverStatus(existingOrder.driver_id, 'available', client);
      await setVehicleStatus(existingOrder.vehicle_id, 'available', client);
      await setTrailerStatus(existingOrder.trailer_id, 'available', client);
    }

    await client.query('COMMIT');
    return deletedOrder;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  getAllTransportOrders,
  getTransportOrderById,
  getAvailableResources,
  createTransportOrder,
  updateTransportOrder,
  deleteTransportOrder,
};