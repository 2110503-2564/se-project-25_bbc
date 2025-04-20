import express from 'express';
import { protect , authorize } from '../middlewares/auth.js';
import * as chatController from '../controllers/chatController.js';

const router = express.Router();

// -------------------------- Chat Routes -------------------------- //

router.post('/insert', protect , chatController.insertChat);
router.post('/promotion', protect , authorize('hotel_admin' , 'super_admin') , chatController.promotion);
router.post('/emergency', protect , authorize('hotel_admin' , 'super_admin') , chatController.emergency);

export default router;