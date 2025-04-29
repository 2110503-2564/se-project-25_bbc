import express from 'express';
import { protect , authorize } from '../middlewares/auth.js';
import * as chatController from '../controllers/chatController.js';

const router = express.Router();

// -------------------------- Chat Routes -------------------------- //

router.post('/insert', protect , chatController.insertChat);
router.post('/notification', protect , authorize('hotel_admin' , 'super_admin') , chatController.notification);

/**
 * @swagger
 * tags:
 *   name: Chats
 *   description: Chat management APIs
 */

/**
 * @swagger
 * /api/chat/insert:
 *   post:
 *     summary: Insert or create a chat session
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Hotel ID is required to start a chat
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hotel_id
 *             properties:
 *               hotel_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the hotel
 *     responses:
 *       201:
 *         description: Chat session inserted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 chat:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     hotel_id:
 *                       type: string
 *                     account_id:
 *                       type: string
 *                     type:
 *                       type: string
 *                       enum: [single, group]
 *                     createdAt:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/chat/notification:
 *   post:
 *     summary: Create and broadcast a notification
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Send a notification to users
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - head
 *               - detail
 *               - type
 *             properties:
 *               hotel_id:
 *                 type: string
 *                 format: uuid
 *                 description: Hotel ID (optional if attached to hotel admin user)
 *               account_id:
 *                 type: string
 *                 format: uuid
 *                 description: Optional, ID of the account sending the notification
 *               head:
 *                 type: string
 *                 description: Title of the notification
 *               detail:
 *                 type: string
 *                 description: Detailed message of the notification
 *               type:
 *                 type: string
 *                 enum: [promotion, news, emergency, booking]
 *                 description: Type of notification
 *     responses:
 *       201:
 *         description: Notification created and sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 notification:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     hotel_id:
 *                       type: string
 *                     account_id:
 *                       type: string
 *                     head:
 *                       type: string
 *                     detail:
 *                       type: string
 *                     type:
 *                       type: string
 *                       enum: [promotion, news, emergency, booking]
 *                     createdAt:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *       500:
 *         description: Server error
 */

export default router;