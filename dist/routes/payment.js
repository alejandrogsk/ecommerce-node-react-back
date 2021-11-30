"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = __importDefault(require("../controllers/paymentController"));
const router = express_1.Router();
router.post("/checkout", paymentController_1.default);
exports.default = router;
//# sourceMappingURL=payment.js.map