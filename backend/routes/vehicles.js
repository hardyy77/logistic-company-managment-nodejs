const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

/**
 * @openapi
 * /vehicles:
 *   get:
 *     summary: Pobiera listę pojazdów
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista pojazdów
 *       401:
 *         description: Brak tokena lub nieprawidłowy token
 *       403:
 *         description: Brak uprawnień
 */
router.get(
  '/',
  authMiddleware,
  roleMiddleware('admin', 'dispatcher'),
  vehicleController.getVehicles
);

/**
 * @openapi
 * /vehicles/{id}:
 *   get:
 *     summary: Pobiera pojazd po ID
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID pojazdu
 *     responses:
 *       200:
 *         description: Dane pojazdu
 *       404:
 *         description: Pojazd nie został znaleziony
 */
router.get(
  '/:id',
  authMiddleware,
  roleMiddleware('admin', 'dispatcher'),
  vehicleController.getVehicle
);

/**
 * @openapi
 * /vehicles:
 *   post:
 *     summary: Tworzy nowy pojazd
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - registrationNumber
 *               - brand
 *               - model
 *               - vehicleType
 *               - capacityKg
 *             properties:
 *               registrationNumber:
 *                 type: string
 *                 example: RZ1234A
 *               brand:
 *                 type: string
 *                 example: Scania
 *               model:
 *                 type: string
 *                 example: R450
 *               productionYear:
 *                 type: integer
 *                 example: 2021
 *               vehicleType:
 *                 type: string
 *                 example: truck
 *               capacityKg:
 *                 type: number
 *                 example: 24000
 *               mileage:
 *                 type: integer
 *                 example: 180000
 *               status:
 *                 type: string
 *                 example: available
 *               inspectionValidUntil:
 *                 type: string
 *                 example: 2027-06-30
 *               insuranceValidUntil:
 *                 type: string
 *                 example: 2027-12-31
 *     responses:
 *       201:
 *         description: Pojazd został utworzony
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware('admin', 'dispatcher'),
  vehicleController.createVehicle
);

/**
 * @openapi
 * /vehicles/{id}:
 *   put:
 *     summary: Aktualizuje pojazd
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID pojazdu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - registrationNumber
 *               - brand
 *               - model
 *               - vehicleType
 *               - capacityKg
 *               - status
 *             properties:
 *               registrationNumber:
 *                 type: string
 *                 example: RZ1234A
 *               brand:
 *                 type: string
 *                 example: Scania
 *               model:
 *                 type: string
 *                 example: R450
 *               productionYear:
 *                 type: integer
 *                 example: 2021
 *               vehicleType:
 *                 type: string
 *                 example: truck
 *               capacityKg:
 *                 type: number
 *                 example: 24000
 *               mileage:
 *                 type: integer
 *                 example: 180000
 *               status:
 *                 type: string
 *                 example: in_service
 *               inspectionValidUntil:
 *                 type: string
 *                 example: 2027-06-30
 *               insuranceValidUntil:
 *                 type: string
 *                 example: 2027-12-31
 *     responses:
 *       200:
 *         description: Pojazd został zaktualizowany
 *       404:
 *         description: Pojazd nie został znaleziony
 */
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('admin', 'dispatcher'),
  vehicleController.updateVehicle
);

/**
 * @openapi
 * /vehicles/{id}:
 *   delete:
 *     summary: Usuwa pojazd
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID pojazdu
 *     responses:
 *       200:
 *         description: Pojazd został usunięty
 *       404:
 *         description: Pojazd nie został znaleziony
 */
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('admin'),
  vehicleController.deleteVehicle
);

module.exports = router;