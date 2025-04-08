import express from 'express';
import { protect , authorize } from '../middlewares/auth.js';
import { roomExist , hotelExist , bookingExist } from '../middlewares/exist.js';
import * as bookingController from '../controllers/bookingController.js';

const router = express.Router();

// -------------------------- Booking Routes -------------------------- //

router.get('/search' , bookingController.searchBooking);
router.post('/pending' , protect , roomExist , hotelExist , bookingController.createBooking);

router.put('/accept' , protect , authorize('hotel_admin' , 'super_admin') , bookingExist , bookingController.acceptedBooking);
router.put('/reject' , protect , authorize('hotel_admin' , 'super_admin') , bookingExist , bookingController.rejectedBooking);
router.put('/confirm' , protect , bookingExist , bookingController.confirmedBooking);
router.put('/checked-in' , protect , authorize('hotel_admin' , 'super_admin') , bookingExist , bookingController.checkInBooking);
router.put('/checked-out' , protect , authorize('hotel_admin' , 'super_admin') , bookingExist , bookingController.checkOutBooking);

router.delete('/:booking_id' , protect , authorize('hotel_admin' , 'super_admin') , bookingExist , bookingController.deleteBooking);

export default router;