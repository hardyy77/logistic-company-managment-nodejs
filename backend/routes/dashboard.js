const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

/**
 * @openapi
 * /dashboard/stats:
 *   get:
 *     summary: Pobiera podstawowe statystyki dashboardu
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statystyki dashboardu
 */
router.get(
  '/stats',
  authMiddleware,
  roleMiddleware('admin', 'dispatcher'),
  dashboardController.getDashboardStats
);

module.exports = router;