import express from 'express';
import { protect , authorize } from '../middlewares/auth.js';
import * as roomController from '../controllers/roomController.js';

const router = express.Router();

// -------------------------- Room Routes -------------------------- //

router.get('/search' , roomController.searchRoom);
router.post('/', protect , authorize('hotel_admin , super_admin') , roomController.createRoom);
router.put('/:room_id', protect , authorize('hotel_admin , super_admin') , roomController.updateRoom);

export default router;