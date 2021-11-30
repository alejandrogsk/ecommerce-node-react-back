import { Router } from "express";
import { register, login, profile } from "../controllers/authController";


import { TokenValidator } from "../libs/verifyToken";

const router: Router = Router();

router.post("/register", register);

router.post("/login", login);

router.get("/profile", TokenValidator, profile);

export default router;