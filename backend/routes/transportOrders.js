const express = require('express');
const router = express.Router();
const transportOrderController = require('../controllers/transportOrderController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

/**
 * @openapi
 * /transport-orders:
 *   get:
 *     summary: Pobiera listę zleceń transportowych
 *     tags:
 *       - Transport Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista zleceń transportowych
 */
router.get(
  '/',
  authMiddleware,
  roleMiddleware('admin', 'dispatcher'),
  transportOrderController.getTransportOrders
);

/**
 * @openapi
 * /transport-orders/{id}:
 *   get:
 *     summary: Pobiera zlecenie transportowe po ID
 *     tags:
 *       - Transport Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID zlecenia
 *     responses:
 *       200:
 *         description: Dane zlecenia transportowego
 *       404:
 *         description: Zlecenie transportowe nie zostało znalezione
 */
router.get(
  '/:id',
  authMiddleware,
  roleMiddleware('admin', 'dispatcher'),
  transportOrderController.getTransportOrder
);

/**
 * @openapi
 * /transport-orders:
 *   post:
 *     summary: Tworzy nowe zlecenie transportowe
 *     tags:
 *       - Transport Orders
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderNumber
 *               - clientName
 *               - pickupLocation
 *               - deliveryLocation
 *               - cargoWeightKg
 *               - plannedDate
 *             properties:
 *               orderNumber:
 *                 type: string
 *                 example: ZT-2026-001
 *               clientName:
 *                 type: string
 *                 example: Firma XYZ
 *               pickupLocation:
 *                 type: string
 *                 example: Rzeszów
 *               deliveryLocation:
 *                 type: string
 *                 example: Kraków
 *               cargoWeightKg:
 *                 type: number
 *                 example: 12000
 *               cargoType:
 *                 type: string
 *                 example: elektronika
 *               plannedDistanceKm:
 *                 type: number
 *                 example: 170
 *               plannedDurationMinutes:
 *                 type: integer
 *                 example: 180
 *               estimatedCost:
 *                 type: number
 *                 example: 900
 *               plannedDate:
 *                 type: string
 *                 example: 2026-05-20
 *               status:
 *                 type: string
 *                 example: new
 *               driverId:
 *                 type: integer
 *                 example: 1
 *               vehicleId:
 *                 type: integer
 *                 example: 1
 *               createdByUserId:
 *                 type: integer
 *                 example: 6
 *     responses:
 *       201:
 *         description: Zlecenie transportowe zostało utworzone
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware('admin', 'dispatcher'),
  transportOrderController.createTransportOrder
);

/**
 * @openapi
 * /transport-orders/{id}:
 *   put:
 *     summary: Aktualizuje zlecenie transportowe
 *     tags:
 *       - Transport Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID zlecenia
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderNumber
 *               - clientName
 *               - pickupLocation
 *               - deliveryLocation
 *               - cargoWeightKg
 *               - plannedDate
 *               - status
 *             properties:
 *               orderNumber:
 *                 type: string
 *                 example: ZT-2026-001
 *               clientName:
 *                 type: string
 *                 example: Firma XYZ
 *               pickupLocation:
 *                 type: string
 *                 example: Rzeszów
 *               deliveryLocation:
 *                 type: string
 *                 example: Kraków
 *               cargoWeightKg:
 *                 type: number
 *                 example: 12000
 *               cargoType:
 *                 type: string
 *                 example: elektronika
 *               plannedDistanceKm:
 *                 type: number
 *                 example: 170
 *               plannedDurationMinutes:
 *                 type: integer
 *                 example: 180
 *               estimatedCost:
 *                 type: number
 *                 example: 900
 *               plannedDate:
 *                 type: string
 *                 example: 2026-05-20
 *               status:
 *                 type: string
 *                 example: planned
 *               driverId:
 *                 type: integer
 *                 example: 1
 *               vehicleId:
 *                 type: integer
 *                 example: 1
 *               createdByUserId:
 *                 type: integer
 *                 example: 6
 *     responses:
 *       200:
 *         description: Zlecenie transportowe zostało zaktualizowane
 *       404:
 *         description: Zlecenie transportowe nie zostało znalezione
 */
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('admin', 'dispatcher'),
  transportOrderController.updateTransportOrder
);

/**
 * @openapi
 * /transport-orders/{id}:
 *   delete:
 *     summary: Usuwa zlecenie transportowe
 *     tags:
 *       - Transport Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID zlecenia
 *     responses:
 *       200:
 *         description: Zlecenie transportowe zostało usunięte
 *       404:
 *         description: Zlecenie transportowe nie zostało znalezione
 */
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('admin'),
  transportOrderController.deleteTransportOrder
);

module.exports = router;