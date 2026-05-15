const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permissionController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

/**
 * @openapi
 * /permissions:
 *   get:
 *     summary: Pobiera listę wszystkich uprawnień
 *     tags:
 *       - Permissions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista uprawnień
 */
router.get(
  '/',
  authMiddleware,
  roleMiddleware('admin', 'dispatcher'),
  permissionController.getPermissions
);

/**
 * @openapi
 * /permissions/driver/{driverId}:
 *   get:
 *     summary: Pobiera uprawnienia kierowcy
 *     tags:
 *       - Permissions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: driverId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista uprawnień kierowcy
 */
router.get(
  '/driver/:driverId',
  authMiddleware,
  roleMiddleware('admin', 'dispatcher'),
  permissionController.getDriverPermissions
);

/**
 * @openapi
 * /permissions/driver/{driverId}:
 *   post:
 *     summary: Dodaje uprawnienie kierowcy
 *     tags:
 *       - Permissions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: driverId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permissionId
 *             properties:
 *               permissionId:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Uprawnienie zostało dodane
 */
router.post(
  '/driver/:driverId',
  authMiddleware,
  roleMiddleware('admin', 'dispatcher'),
  permissionController.addDriverPermission
);

/**
 * @openapi
 * /permissions/driver/{driverId}:
 *   delete:
 *     summary: Usuwa uprawnienie kierowcy
 *     tags:
 *       - Permissions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: driverId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permissionId
 *             properties:
 *               permissionId:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Uprawnienie zostało usunięte
 */
router.delete(
  '/driver/:driverId',
  authMiddleware,
  roleMiddleware('admin'),
  permissionController.removeDriverPermission
);

module.exports = router;