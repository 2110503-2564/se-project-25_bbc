import express from 'express';
import { protect , authorize } from '../middlewares/auth.js';
import * as bookingController from '../controllers/bookingController.js';

const router = express.Router();

// -------------------------- Booking Routes -------------------------- //

export default router;