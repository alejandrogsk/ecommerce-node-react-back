"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const verifyToken_1 = require("../libs/verifyToken");
const router = express_1.Router();
router.post("/register", authController_1.register);
router.post("/login", authController_1.login);
router.get("/profile", verifyToken_1.TokenValidator, authController_1.profile);
exports.default = router;
//# sourceMappingURL=auth.js.map