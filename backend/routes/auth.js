const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Rejestracja użytkownika systemu
 *     tags:
 *       - Auth
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
 *               - password
 *               - role
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
 *               password:
 *                 type: string
 *                 example: tajnehaslo123
 *               role:
 *                 type: string
 *                 example: admin
 *     responses:
 *       201:
 *         description: Użytkownik został zarejestrowany
 */
router.post('/register', authController.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Logowanie użytkownika
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: jan.kowalski@example.com
 *               password:
 *                 type: string
 *                 example: tajnehaslo123
 *     responses:
 *       200:
 *         description: Logowanie zakończone sukcesem
 */
router.post('/login', authController.login);

module.exports = router;