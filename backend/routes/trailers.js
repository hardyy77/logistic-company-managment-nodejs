const express = require('express');
const router = express.Router();
const trailerController = require('../controllers/trailerController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

/**
 * @openapi
 * /trailers:
 *   get:
 *     summary: Pobiera listę naczep
 *     tags:
 *       - Trailers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista naczep
 */
router.get(
  '/',
  authMiddleware,
  roleMiddleware('admin', 'dispatcher'),
  trailerController.getTrailers
);

/**
 * @openapi
 * /trailers/{id}:
 *   get:
 *     summary: Pobiera naczepę po ID
 *     tags:
 *       - Trailers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID naczepy
 *     responses:
 *       200:
 *         description: Dane naczepy
 *       404:
 *         description: Naczepa nie została znaleziona
 */
router.get(
  '/:id',
  authMiddleware,
  roleMiddleware('admin', 'dispatcher'),
  trailerController.getTrailer
);

/**
 * @openapi
 * /trailers:
 *   post:
 *     summary: Tworzy nową naczepę
 *     tags:
 *       - Trailers
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
 *               - trailerType
 *               - capacityKg
 *             properties:
 *               registrationNumber:
 *                 type: string
 *                 example: RZ9876T
 *               trailerType:
 *                 type: string
 *                 example: curtain
 *               capacityKg:
 *                 type: number
 *                 example: 28000
 *               volumeM3:
 *                 type: number
 *                 example: 90
 *               status:
 *                 type: string
 *                 example: available
 *               inspectionValidUntil:
 *                 type: string
 *                 example: 2027-11-30
 *     responses:
 *       201:
 *         description: Naczepa została utworzona
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware('admin', 'dispatcher'),
  trailerController.createTrailer
);

/**
 * @openapi
 * /trailers/{id}:
 *   put:
 *     summary: Aktualizuje naczepę
 *     tags:
 *       - Trailers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID naczepy
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - registrationNumber
 *               - trailerType
 *               - capacityKg
 *               - status
 *             properties:
 *               registrationNumber:
 *                 type: string
 *                 example: RZ9876T
 *               trailerType:
 *                 type: string
 *                 example: refrigerated
 *               capacityKg:
 *                 type: number
 *                 example: 28000
 *               volumeM3:
 *                 type: number
 *                 example: 90
 *               status:
 *                 type: string
 *                 example: in_service
 *               inspectionValidUntil:
 *                 type: string
 *                 example: 2027-11-30
 *     responses:
 *       200:
 *         description: Naczepa została zaktualizowana
 *       404:
 *         description: Naczepa nie została znaleziona
 */
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('admin', 'dispatcher'),
  trailerController.updateTrailer
);

/**
 * @openapi
 * /trailers/{id}:
 *   delete:
 *     summary: Usuwa naczepę
 *     tags:
 *       - Trailers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID naczepy
 *     responses:
 *       200:
 *         description: Naczepa została usunięta
 *       404:
 *         description: Naczepa nie została znaleziona
 */
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('admin'),
  trailerController.deleteTrailer
);

module.exports = router;