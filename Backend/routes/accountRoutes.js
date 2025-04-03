import express from 'express';
import { protect , authorize } from '../middlewares/auth.js';
import * as accountController from '../controllers/accountController.js';

const router = express.Router();

// -------------------------- Account Routes -------------------------- //

router.get('/profile', protect , accountController.getProfile);

export default router;