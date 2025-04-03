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

export default router;