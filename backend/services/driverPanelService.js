const pool = require('../db');

async function getDriverByUserId(userId) {
  const result = await pool.query(`
    SELECT
      d.id,
      d.first_name,
      d.last_name,
      d.phone,
      d.email,
      d.license_number,
      d.license_category,
      d.medical_exam_valid_until,
      d.status,
      d.user_id,
      d.created_at,
      u.email AS user_email,
      COALESCE(
        json_agg(
          json_build_object(
            'id', p.id,
            'code', p.code,
            'name', p.name,
            'category', p.category
          )
          ORDER BY p.code
        ) FILTER (WHERE p.id IS NOT NULL),
        '[]'::json
      ) AS permissions
    FROM drivers d
    LEFT JOIN users u ON u.id = d.user_id
    LEFT JOIN driver_permissions dp ON dp.driver_id = d.id
    LEFT JOIN permissions p ON p.id = dp.permission_id
    WHERE d.user_id = $1
    GROUP BY
      d.id, d.first_name, d.last_name, d.phone, d.email,
      d.license_number, d.license_category, d.medical_exam_valid_until,
      d.status, d.user_id, d.created_at, u.email
  `, [userId]);

  return result.rows[0] || null;
}

async function getCurrentOrderByUserId(userId) {
  const result = await pool.query(`
    SELECT
      t.id,
      t.order_number,
      t.client_name,
      t.pickup_location,
      t.delivery_location,
      t.cargo_weight_kg,
      t.cargo_type,
      t.cargo_name,
      t.planned_distance_km,
      t.planned_duration_minutes,
      t.estimated_cost,
      t.planned_date,
      t.status,
      t.created_at,
      v.id AS vehicle_id,
      v.registration_number AS vehicle_registration_number,
      v.brand AS vehicle_brand,
      v.model AS vehicle_model,
      tr.id AS trailer_id,
      tr.registration_number AS trailer_registration_number,
      tr.trailer_type
    FROM transport_orders t
    JOIN drivers d ON d.id = t.driver_id
    LEFT JOIN vehicles v ON v.id = t.vehicle_id
    LEFT JOIN trailers tr ON tr.id = t.trailer_id
    WHERE d.user_id = $1
      AND t.status IN ('planned', 'in_progress')
    ORDER BY
      CASE
        WHEN t.status = 'in_progress' THEN 1
        WHEN t.status = 'planned' THEN 2
        ELSE 3
      END,
      t.planned_date ASC,
      t.id ASC
    LIMIT 1
  `, [userId]);

  return result.rows[0] || null;
}

async function getOrderHistoryByUserId(userId) {
  const result = await pool.query(`
    SELECT
      t.id,
      t.order_number,
      t.client_name,
      t.pickup_location,
      t.delivery_location,
      t.cargo_weight_kg,
      t.cargo_type,
      t.cargo_name,
      t.planned_distance_km,
      t.planned_duration_minutes,
      t.estimated_cost,
      t.planned_date,
      t.status,
      t.created_at,
      v.registration_number AS vehicle_registration_number,
      tr.registration_number AS trailer_registration_number,
      tr.trailer_type
    FROM transport_orders t
    JOIN drivers d ON d.id = t.driver_id
    LEFT JOIN vehicles v ON v.id = t.vehicle_id
    LEFT JOIN trailers tr ON tr.id = t.trailer_id
    WHERE d.user_id = $1
      AND t.status IN ('completed', 'cancelled')
    ORDER BY t.planned_date DESC, t.id DESC
  `, [userId]);

  return result.rows;
}

async function startCurrentOrder(userId) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const driverResult = await client.query(
      `SELECT id FROM drivers WHERE user_id = $1`,
      [userId]
    );

    const driver = driverResult.rows[0];
    if (!driver) {
      await client.query('ROLLBACK');
      return { error: 'Nie znaleziono profilu kierowcy', statusCode: 404 };
    }

    const orderResult = await client.query(`
      SELECT id, status
      FROM transport_orders
      WHERE driver_id = $1
        AND status = 'planned'
      ORDER BY planned_date ASC, id ASC
      LIMIT 1
    `, [driver.id]);

    const order = orderResult.rows[0];
    if (!order) {
      await client.query('ROLLBACK');
      return { error: 'Brak zlecenia gotowego do rozpoczęcia', statusCode: 400 };
    }

    const updatedOrderResult = await client.query(`
      UPDATE transport_orders
      SET status = 'in_progress'
      WHERE id = $1
      RETURNING *
    `, [order.id]);

    await client.query(`
      UPDATE drivers
      SET status = 'in_route'
      WHERE id = $1
    `, [driver.id]);

    await client.query('COMMIT');
    return updatedOrderResult.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function completeCurrentOrder(userId) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const driverResult = await client.query(
      `SELECT id FROM drivers WHERE user_id = $1`,
      [userId]
    );

    const driver = driverResult.rows[0];
    if (!driver) {
      await client.query('ROLLBACK');
      return { error: 'Nie znaleziono profilu kierowcy', statusCode: 404 };
    }

    const orderResult = await client.query(`
      SELECT id, status, vehicle_id, trailer_id
      FROM transport_orders
      WHERE driver_id = $1
        AND status = 'in_progress'
      ORDER BY planned_date ASC, id ASC
      LIMIT 1
    `, [driver.id]);

    const order = orderResult.rows[0];
    if (!order) {
      await client.query('ROLLBACK');
      return { error: 'Brak zlecenia w trakcie realizacji', statusCode: 400 };
    }

    const updatedOrderResult = await client.query(`
      UPDATE transport_orders
      SET status = 'completed'
      WHERE id = $1
      RETURNING *
    `, [order.id]);

    await client.query(`
      UPDATE drivers
      SET status = 'available'
      WHERE id = $1
    `, [driver.id]);

    if (order.vehicle_id) {
      await client.query(`
        UPDATE vehicles
        SET status = 'available'
        WHERE id = $1
      `, [order.vehicle_id]);
    }

    if (order.trailer_id) {
      await client.query(`
        UPDATE trailers
        SET status = 'available'
        WHERE id = $1
      `, [order.trailer_id]);
    }

    await client.query('COMMIT');
    return updatedOrderResult.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  getDriverByUserId,
  getCurrentOrderByUserId,
  getOrderHistoryByUserId,
  startCurrentOrder,
  completeCurrentOrder,
};