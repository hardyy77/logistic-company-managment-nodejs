const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Pobiera listę użytkowników systemu
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista użytkowników
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   first_name:
 *                     type: string
 *                     example: Jan
 *                   last_name:
 *                     type: string
 *                     example: Kowalski
 *                   email:
 *                     type: string
 *                     example: jan.kowalski@example.com
 *                   is_active:
 *                     type: boolean
 *                     example: true
 *                   created_at:
 *                     type: string
 *                     example: 2026-03-21T10:00:00.000Z
 *                   role:
 *                     type: string
 *                     example: admin
 *       401:
 *         description: Brak tokena lub nieprawidłowy token
 *       403:
 *         description: Brak uprawnień
 */
router.get(
  '/',
  authMiddleware,
  roleMiddleware('admin', 'dispatcher'),
  userController.getUsers
);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Pobiera jednego użytkownika po ID
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID użytkownika
 *     responses:
 *       200:
 *         description: Dane użytkownika
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 first_name:
 *                   type: string
 *                   example: Jan
 *                 last_name:
 *                   type: string
 *                   example: Kowalski
 *                 email:
 *                   type: string
 *                   example: jan.kowalski@example.com
 *                 is_active:
 *                   type: boolean
 *                   example: true
 *                 created_at:
 *                   type: string
 *                   example: 2026-03-21T10:00:00.000Z
 *                 role:
 *                   type: string
 *                   example: admin
 *       401:
 *         description: Brak tokena lub nieprawidłowy token
 *       403:
 *         description: Brak uprawnień
 *       404:
 *         description: Użytkownik nie został znaleziony
 */
router.get(
  '/:id',
  authMiddleware,
  roleMiddleware('admin', 'dispatcher'),
  userController.getUser
);

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     summary: Aktualizuje użytkownika po ID
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID użytkownika
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - roleId
 *               - isActive
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Jan
 *               lastName:
 *                 type: string
 *                 example: Kowalski
 *               email:
 *                 type: string
 *                 example: jan.kowalski@example.com
 *               roleId:
 *                 type: integer
 *                 example: 1
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Użytkownik został zaktualizowany
 *       401:
 *         description: Brak tokena lub nieprawidłowy token
 *       403:
 *         description: Brak uprawnień
 *       404:
 *         description: Użytkownik nie został znaleziony
 */
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('admin'),
  userController.updateUser
);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Usuwa użytkownika po ID
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID użytkownika
 *     responses:
 *       200:
 *         description: Użytkownik został usunięty
 *       401:
 *         description: Brak tokena lub nieprawidłowy token
 *       403:
 *         description: Brak uprawnień
 *       404:
 *         description: Użytkownik nie został znaleziony
 */
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('admin'),
  userController.deleteUser
);

module.exports = router;