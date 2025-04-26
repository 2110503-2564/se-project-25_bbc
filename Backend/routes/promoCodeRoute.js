import express from "express";
import { protect , authorize } from '../middlewares/auth.js';
import { promoCodeExist } from '../middlewares/exist.js';
import * as promoCodeController from "../controllers/promoCodeController.js";

const router = express.Router();

// -------------------------- PromoCode Routes -------------------------- //

router.get("/search", promoCodeController.searchPromocodes);

router.post("/create", protect , authorize('super_admin') , promoCodeController.createPromocode);
router.post("/use", protect , promoCodeController.usePromocode);

router.put("/:promo_id", protect , authorize('hotel_admin' , 'super_admin'), promoCodeExist , promoCodeController.updatePromocode);

router.delete("/:promo_id", protect , authorize('hotel_admin' , 'super_admin'), promoCodeExist , promoCodeController.deletePromocode);

export default router;
