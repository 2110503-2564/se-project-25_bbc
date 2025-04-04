import express from 'express';
import { protect , authorize } from '../middlewares/auth.js';
import { roomExist , hotelExist , bookingExist } from '../middlewares/exist.js';
import * as bookingController from '../controllers/bookingController.js';

const router = express.Router();

// -------------------------- Booking Routes -------------------------- //

router.get('/search' , bookingController.searchBooking);
router.post('/pending' , protect , roomExist , hotelExist , bookingController.createBooking);

router.put('/accept' , protect , roomExist , hotelExist , bookingController.acceptedBooking);
router.put('/reject' , protect , roomExist , hotelExist , bookingController.rejectedBooking);
router.put('/confirm' , protect , roomExist , hotelExist , bookingController.confirmedBooking);

export default router;