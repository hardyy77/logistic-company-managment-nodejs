const dashboardService = require('../services/dashboardService');

async function getDashboardStats(req, res) {
  try {
    const stats = await dashboardService.getDashboardStats();
    return res.json(stats);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: 'Błąd pobierania danych dashboardu',
    });
  }
}

module.exports = {
  getDashboardStats,
};