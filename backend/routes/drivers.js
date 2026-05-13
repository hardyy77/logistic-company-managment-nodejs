const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

/**
 * @openapi
 * /drivers:
 *   get:
 *     summary: Pobiera listę kierowców
 *     tags:
 *       - Drivers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista kierowców
 *       401:
 *         description: Brak tokena lub nieprawidłowy token
 *       403:
 *         description: Brak uprawnień
 */
router.get(
  '/',
  authMiddleware,
  roleMiddleware('admin', 'dispatcher'),
  driverController.getDrivers
);

/**
 * @openapi
 * /drivers/{id}:
 *   get:
 *     summary: Pobiera kierowcę po ID
 *     tags:
 *       - Drivers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID kierowcy
 *     responses:
 *       200:
 *         description: Dane kierowcy
 *       404:
 *         description: Kierowca nie został znaleziony
 */
router.get(
  '/:id',
  authMiddleware,
  roleMiddleware('admin', 'dispatcher'),
  driverController.getDriver
);

/**
 * @openapi
 * /drivers:
 *   post:
 *     summary: Tworzy nowego kierowcę
 *     tags:
 *       - Drivers
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - licenseNumber
 *               - licenseCategory
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Jan
 *               lastName:
 *                 type: string
 *                 example: Kowalski
 *               phone:
 *                 type: string
 *                 example: 500600700
 *               email:
 *                 type: string
 *                 example: jan.kowalski@example.com
 *               licenseNumber:
 *                 type: string
 *                 example: ABC123456
 *               licenseCategory:
 *                 type: string
 *                 example: C+E
 *               medicalExamValidUntil:
 *                 type: string
 *                 example: 2027-12-31
 *               status:
 *                 type: string
 *                 example: active
 *               userId:
 *                 type: integer
 *                 example: 6
 *     responses:
 *       201:
 *         description: Kierowca został utworzony
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware('admin', 'dispatcher'),
  driverController.createDriver
);

/**
 * @openapi
 * /drivers/{id}:
 *   put:
 *     summary: Aktualizuje kierowcę
 *     tags:
 *       - Drivers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID kierowcy
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - licenseNumber
 *               - licenseCategory
 *               - status
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Jan
 *               lastName:
 *                 type: string
 *                 example: Kowalski
 *               phone:
 *                 type: string
 *                 example: 500600700
 *               email:
 *                 type: string
 *                 example: jan.kowalski@example.com
 *               licenseNumber:
 *                 type: string
 *                 example: ABC123456
 *               licenseCategory:
 *                 type: string
 *                 example: C+E
 *               medicalExamValidUntil:
 *                 type: string
 *                 example: 2027-12-31
 *               status:
 *                 type: string
 *                 example: active
 *               userId:
 *                 type: integer
 *                 example: 6
 *     responses:
 *       200:
 *         description: Kierowca został zaktualizowany
 *       404:
 *         description: Kierowca nie został znaleziony
 */
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('admin', 'dispatcher'),
  driverController.updateDriver
);

/**
 * @openapi
 * /drivers/{id}:
 *   delete:
 *     summary: Usuwa kierowcę
 *     tags:
 *       - Drivers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID kierowcy
 *     responses:
 *       200:
 *         description: Kierowca został usunięty
 *       404:
 *         description: Kierowca nie został znaleziony
 */
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('admin'),
  driverController.deleteDriver
);

module.exports = router;