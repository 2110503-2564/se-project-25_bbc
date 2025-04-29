import express from 'express';
import { protect , authorize } from '../middlewares/auth.js';
import { hotelExist } from '../middlewares/exist.js';
import * as hotelController from '../controllers/hotelController.js';

const router = express.Router();

// -------------------------- Hotel Routes -------------------------- //

router.get('/search' , hotelController.searchHotel);
router.post('/', protect , authorize('super_admin') , hotelController.createHotel);
router.put('/:hotel_id', protect , authorize('super_admin') , hotelExist , hotelController.updateHotel);
router.delete('/:hotel_id', protect , authorize('super_admin') , hotelExist , hotelController.deleteHotel);
router.get('/', hotelController.getAllHotels);

/**
 * @swagger
 * tags:
 *   name: Hotel
 *   description: Hotel management (search, create, update, delete)
 *
 * components:
 *   schemas:
 *     Hotel:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         tel:
 *           type: string
 *         description:
 *           type: string
 *         address:
 *           type: object
 *           properties:
 *             city:
 *               type: string
 *             street_name:
 *               type: string
 *             street_address:
 *               type: string
 *             zipcode:
 *               type: string
 *         location:
 *           type: object
 *           properties:
 *             latitude:
 *               type: number
 *             longtitude:
 *               type: number
 *         image_url:
 *           type: string
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 *
 *     CreateHotelInput:
 *       type: object
 *       required:
 *         - name
 *         - tel
 *         - address
 *         - location
 *       properties:
 *         name:
 *           type: string
 *         tel:
 *           type: string
 *         description:
 *           type: string
 *         address:
 *           type: object
 *           required:
 *             - city
 *             - street_name
 *             - street_address
 *             - zipcode
 *           properties:
 *             city:
 *               type: string
 *             street_name:
 *               type: string
 *             street_address:
 *               type: string
 *             zipcode:
 *               type: string
 *         location:
 *           type: object
 *           required:
 *             - latitude
 *             - longtitude
 *           properties:
 *             latitude:
 *               type: number
 *             longtitude:
 *               type: number
 *         image_url:
 *           type: string
 *
 * /api/hotel/search:
 *   get:
 *     summary: Search hotels with filters
 *     tags: [Hotel]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *       - in: query
 *         name: select
 *         schema:
 *           type: string
 *         description: Comma-separated fields to return
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: Populate fields (e.g., rooms)
 *     responses:
 *       200:
 *         description: List of hotels
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 hotels:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Hotel'
 *
 * /api/hotel:
 *   post:
 *     summary: Create a new hotel (super_admin only)
 *     tags: [Hotel]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateHotelInput'
 *     responses:
 *       201:
 *         description: Hotel created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 hotel:
 *                   $ref: '#/components/schemas/Hotel'
 *       500:
 *         description: Server error
 *
 * /api/hotel/{hotel_id}:
 *   put:
 *     summary: Update a hotel by ID (super_admin only)
 *     tags: [Hotel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hotel_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateHotelInput'
 *     responses:
 *       200:
 *         description: Hotel updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 hotel:
 *                   $ref: '#/components/schemas/Hotel'
 *       500:
 *         description: Server error
 *
 *   delete:
 *     summary: Delete a hotel and related data (super_admin only)
 *     tags: [Hotel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hotel_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hotel deleted successfully
 *       500:
 *         description: Server error
 */

export default router;