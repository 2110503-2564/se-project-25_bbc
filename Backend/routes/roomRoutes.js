import express from 'express';
import { protect , authorize } from '../middlewares/auth.js';
import { roomExist } from '../middlewares/exist.js';
import * as roomController from '../controllers/roomController.js';

const router = express.Router();

// -------------------------- Room Routes -------------------------- //

router.get('/search', roomController.searchRoom);
router.post('/', protect , authorize('hotel_admin' , 'super_admin') , roomController.createRoom);
router.put('/:room_id', protect , authorize('hotel_admin' , 'super_admin') , roomExist , roomController.updateRoom);
router.delete('/:room_id', protect , authorize('hotel_admin' , 'super_admin') , roomExist , roomController.deleteRoom);

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: Room management endpoints
 */

/**
 * @swagger
 * /api/room/search:
 *   get:
 *     summary: Search for rooms
 *     tags: [Rooms]
 *     parameters:
 *       - in: query
 *         name: select
 *         schema:
 *           type: string
 *         description: Fields to return
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: Populate related documents
 *     responses:
 *       200:
 *         description: Successfully retrieved rooms
 */

/**
 * @swagger
 * /api/room:
 *   post:
 *     summary: Create a new room
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hotel_id:
 *                 type: string
 *               room_number:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [Standard, Deluxe, Suite]
 *               capacity:
 *                 type: integer
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *               rate_per_night:
 *                 type: number
 *     responses:
 *       201:
 *         description: Room created successfully
 */

/**
 * @swagger
 * /api/room/{room_id}:
 *   put:
 *     summary: Update a room
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: room_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Room updated successfully
 */

/**
 * @swagger
 * /api/room/{room_id}:
 *   delete:
 *     summary: Delete a room
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: room_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room deleted successfully
 */

export default router;