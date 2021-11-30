"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productsControllers_1 = require("../controllers/productsControllers");
const verifyToken_1 = require("../libs/verifyToken");
const verifyRole_1 = require("../libs/verifyRole");
const storage_img_1 = __importDefault(require("../libs/storage-img"));
const router = express_1.Router();
router.post("/product", [verifyToken_1.TokenValidator, verifyRole_1.verifyRole, storage_img_1.default.single("image")], productsControllers_1.createProduct);
router.put("/product/:id", [verifyToken_1.TokenValidator, verifyRole_1.verifyRole, storage_img_1.default.single("image")], productsControllers_1.updateProduct);
router.get("/products", productsControllers_1.getProducts);
router.get("/product/:id", productsControllers_1.getProduct);
router.delete("/product/:id", productsControllers_1.deleteProduct);
//Categories
router.get("/products/:category", productsControllers_1.getCategory);
//Searching
router.get("/search", productsControllers_1.getProductBySearch);
exports.default = router;
//# sourceMappingURL=products.js.map