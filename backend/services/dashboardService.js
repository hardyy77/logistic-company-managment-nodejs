const pool = require('../db');

async function getDashboardStats() {
  const [
    driversCount,
    activeDriversCount,
    vehiclesCount,
    availableVehiclesCount,
    trailersCount,
    availableTrailersCount,
    ordersCount,
    newOrdersCount,
    plannedOrdersCount,
    inProgressOrdersCount,
  ] = await Promise.all([
    pool.query(`SELECT COUNT(*)::int AS count FROM drivers`),
    pool.query(`
      SELECT COUNT(*)::int AS count
      FROM drivers
      WHERE status IN ('available', 'in_route')
    `),
    pool.query(`SELECT COUNT(*)::int AS count FROM vehicles`),
    pool.query(`SELECT COUNT(*)::int AS count FROM vehicles WHERE status = 'available'`),
    pool.query(`SELECT COUNT(*)::int AS count FROM trailers`),
    pool.query(`SELECT COUNT(*)::int AS count FROM trailers WHERE status = 'available'`),
    pool.query(`SELECT COUNT(*)::int AS count FROM transport_orders`),
    pool.query(`SELECT COUNT(*)::int AS count FROM transport_orders WHERE status = 'new'`),
    pool.query(`SELECT COUNT(*)::int AS count FROM transport_orders WHERE status = 'planned'`),
    pool.query(`SELECT COUNT(*)::int AS count FROM transport_orders WHERE status = 'in_progress'`),
  ]);

  return {
    drivers: {
      total: driversCount.rows[0].count,
      active: activeDriversCount.rows[0].count,
    },
    vehicles: {
      total: vehiclesCount.rows[0].count,
      available: availableVehiclesCount.rows[0].count,
    },
    trailers: {
      total: trailersCount.rows[0].count,
      available: availableTrailersCount.rows[0].count,
    },
    transportOrders: {
      total: ordersCount.rows[0].count,
      new: newOrdersCount.rows[0].count,
      planned: plannedOrdersCount.rows[0].count,
      inProgress: inProgressOrdersCount.rows[0].count,
    },
  };
}

module.exports = {
  getDashboardStats,
};