import express from 'express';
import { protect , authorize } from '../middlewares/auth.js';
import * as accountController from '../controllers/accountController.js';

const router = express.Router();

// -------------------------- Account Routes -------------------------- //

router.get('/profile', protect , accountController.getProfile);

/**
 * @swagger
 * tags:
 *   name: Accounts
 *   description: Account management and user profile
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     Account:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "6628f5c4f1e52e4b88733de9"
 *         first_name:
 *           type: string
 *           example: "John"
 *         last_name:
 *           type: string
 *           example: "Doe"
 *         full_name:
 *           type: string
 *           example: "John Doe"
 *         tel:
 *           type: string
 *           example: "123-456-7890"
 *         email:
 *           type: string
 *           example: "john.doe@example.com"
 *         role:
 *           type: string
 *           enum: [user, hotel_admin, super_admin]
 *           example: "user"
 *         hotel_id:
 *           type: string
 *           nullable: true
 *           example: "6628f5c4f1e52e4b88733aaa"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-04-23T10:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-04-23T10:05:00Z"
 */

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get account profile
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved account profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Get account profile successfully!
 *                 account:
 *                   $ref: '#/components/schemas/Account'
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: Account not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Account not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Get account profile failed
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
export default router;