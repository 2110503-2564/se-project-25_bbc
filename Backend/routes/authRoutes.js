import express from 'express';
import { protect , authorize } from '../middlewares/auth.js';
import * as authController from '../controllers/authController.js';
import { accountExist } from '../middlewares/exist.js';

const router = express.Router();

// -------------------------- Authentication Routes -------------------------- //

router.post('/register',accountExist, authController.register);
router.post('/login', authController.login);
router.post('/logout',authController.logout);

export default router;