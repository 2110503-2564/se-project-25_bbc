import express from 'express';
import { protect , authorize } from '../middlewares/auth.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// -------------------------- Authentication Routes -------------------------- //

router.get('/profile', protect , authController.getProfile);

router.post('/register', authController.register);
router.post('/login', authController.login);

export default router;