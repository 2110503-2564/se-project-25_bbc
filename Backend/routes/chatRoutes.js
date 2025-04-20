import express from 'express';
import { protect , authorize } from '../middlewares/auth.js';
import * as chatController from '../controllers/chatController.js';

const router = express.Router();

// -------------------------- Chat Routes -------------------------- //

router.post('/insert', protect , chatController.insertChat);

export default router;