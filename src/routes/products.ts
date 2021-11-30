import { Router } from "express";

import {
	createProduct,
	getProducts,
	getProduct,
	deleteProduct,
	updateProduct,
	getCategory,
	getProductBySearch
} from "../controllers/productsControllers";

import { TokenValidator } from "../libs/verifyToken";
import { verifyRole } from "../libs/verifyRole";
import uploadImg from "../libs/storage-img";

const router = Router();

router.post(
	"/product",
	[TokenValidator, verifyRole, uploadImg.single("image")],
	createProduct
);

router.put(
	"/product/:id",
	[TokenValidator, verifyRole, uploadImg.single("image")],
	updateProduct
);

router.get("/products", getProducts);

router.get("/product/:id", getProduct);

router.delete("/product/:id", deleteProduct);

//Categories
router.get("/products/:category", getCategory);

//Searching
router.get("/search", getProductBySearch)

export default router;
