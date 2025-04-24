import express from 'express';
import { protect , authorize } from '../middlewares/auth.js';
import * as authController from '../controllers/authController.js';
import { accountExist } from '../middlewares/exist.js';

const router = express.Router();

// -------------------------- Authentication Routes -------------------------- //

router.post('/register',accountExist, authController.register);
router.post('/login', authController.login);
router.post('/logout',authController.logout);

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication (register, login, logout)
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     RegisterInput:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - email
 *         - tel
 *         - password
 *       properties:
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         email:
 *           type: string
 *         tel:
 *           type: string
 *         password:
 *           type: string
 *         role:
 *           type: string
 *           enum: [user, hotel_admin, super_admin]
 *         hotel_id:
 *           type: string
 *           description: Required if role is hotel_admin
 *       example:
 *         first_name: John
 *         last_name: Doe
 *         email: john.doe@example.com
 *         tel: 1234567890
 *         password: secret123
 *         role: user
 *
 *     LoginInput:
 *       type: object
 *       required:
 *         - password
 *       properties:
 *         email:
 *           type: string
 *         tel:
 *           type: string
 *         password:
 *           type: string
 *       example:
 *         email: john.doe@example.com
 *         password: secret123
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         token:
 *           type: string
 *         account:
 *           $ref: '#/components/schemas/Account'
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Account registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       409:
 *         description: Email or telephone already exists
 *       500:
 *         description: Registration failed
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with email or telephone and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Login failed
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout current user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 *       500:
 *         description: Server error
 */
export default router;