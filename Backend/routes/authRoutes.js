import express from 'express';
import { protect , authorize } from '../middlewares/auth.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// -------------------------- Authentication Routes -------------------------- //

router.post('/register', authController.register);
router.post('/login', authController.login);

export default router;