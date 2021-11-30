import { Router } from "express";
import checkout from "../controllers/paymentController";

const router = Router();

router.post("/checkout", checkout);

export default router;