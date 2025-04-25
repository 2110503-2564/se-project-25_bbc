import express from 'express';
import upload from '../config/upload.js';
import { protect , authorize } from '../middlewares/auth.js';
import { roomExist , hotelExist , bookingExist } from '../middlewares/exist.js';
import * as bookingController from '../controllers/bookingController.js';

const router = express.Router();

// -------------------------- Booking Routes -------------------------- //

router.get('/search' , bookingController.searchBooking);
router.post('/pending' , protect, upload.single('file') , roomExist , hotelExist , bookingController.createBooking);
router.post('/receipt/:booking_id', protect, upload.single('file') , bookingExist , bookingController.uploadReceipt);

router.put('/accept/:booking_id', protect, authorize('hotel_admin', 'super_admin'), bookingExist, bookingController.acceptedBooking);
router.put('/reject/:booking_id' , protect , authorize('hotel_admin' , 'super_admin') , bookingExist , bookingController.rejectedBooking);
router.put('/confirm/:booking_id' , protect , bookingExist , bookingController.confirmedBooking);
router.put('/finish/:booking_id' , protect , authorize('hotel_admin' , 'super_admin') , bookingExist , bookingController.finishedBooking);
router.put('/:booking_id', protect, authorize('hotel_admin' , 'super_admin', 'user') , bookingExist , bookingController.updateBooking)

router.delete('/:booking_id' , protect , authorize('hotel_admin' , 'super_admin') , bookingExist , bookingController.deleteBooking);

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Hotel booking management
 */

/**
 * @swagger
 * /api/booking/search:
 *   get:
 *     summary: Search bookings with filters
 *     tags: [Bookings]
 *     parameters:
 *       - in: query
 *         name: select
 *         schema:
 *           type: string
 *         description: Fields to select (comma separated)
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: Fields to populate (comma separated, format field:subfield)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, accepted, rejected, confirmed, canceled, finished]
 *         description: Filter by booking status
 *     responses:
 *       200:
 *         description: List of bookings
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/booking/pending:
 *   post:
 *     summary: Create a new pending booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - hotel_id
 *               - room_id
 *               - check_in_date
 *               - check_out_date
 *               - num_people
 *               - total_price
 *             properties:
 *               hotel_id:
 *                 type: string
 *               room_id:
 *                 type: string
 *               check_in_date:
 *                 type: string
 *                 format: date
 *               check_out_date:
 *                 type: string
 *                 format: date
 *               num_people:
 *                 type: integer
 *               total_price:
 *                 type: number
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Booking created
 *       400:
 *         description: Invalid input or overlapping booking
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/booking/accept/{booking_id}:
 *   put:
 *     summary: Accept a booking (hotel admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: booking_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking accepted
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/booking/reject/{booking_id}:
 *   put:
 *     summary: Reject a booking (hotel admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: booking_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking rejected
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/booking/confirm/{booking_id}:
 *   put:
 *     summary: Confirm a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: booking_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking confirmed
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/booking/finish/{booking_id}:
 *   put:
 *     summary: Mark booking as finished (hotel admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: booking_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking finished
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/booking/{booking_id}:
 *   put:
 *     summary: Update booking details
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: booking_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               room_number:
 *                 type: string
 *               check_in_date:
 *                 type: string
 *                 format: date
 *               check_out_date:
 *                 type: string
 *                 format: date
 *               num_people:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [pending, accept, reject]
 *     responses:
 *       200:
 *         description: Booking updated
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete a booking (hotel admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: booking_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking deleted
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 */

export default router;