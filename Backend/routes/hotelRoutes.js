import express from 'express';
import { protect , authorize } from '../middlewares/auth.js';
import * as hotelController from '../controllers/hotelController.js';

const router = express.Router();

// -------------------------- Authentication Routes -------------------------- //

router.post('/', protect , authorize('super_admin') , hotelController.createHotel);

export default router;