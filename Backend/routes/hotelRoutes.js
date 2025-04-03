import express from 'express';
import { protect , authorize } from '../middlewares/auth.js';
import * as hotelController from '../controllers/hotelController.js';

const router = express.Router();

// -------------------------- Hotel Routes -------------------------- //

router.get('/search' , hotelController.searchHotel);
router.post('/', protect , authorize('super_admin') , hotelController.createHotel);

export default router;