"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductBySearch = exports.getCategory = exports.deleteProduct = exports.getProduct = exports.getProducts = exports.updateProduct = exports.createProduct = void 0;
const Products_1 = __importDefault(require("../models/Products"));
const cloudinary_1 = __importDefault(require("../libs/cloudinary"));
/**
 * CREATE PRODUCT
 */
exports.createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, category, description, price } = req.body;
    const productFound = yield Products_1.default.findOne({ title });
    if (productFound) {
        return res.status(301).json({ msg: "This product already exists" });
    }
    //console.log(req.file);
    //const img = req.file.path;
    const product = new Products_1.default({
        title,
        category,
        description,
        price,
    });
    //req.file exists thanks to multer
    try {
        if (req.file) {
            console.log('Antes de cloudinary');
            const { secure_url, public_id } = yield cloudinary_1.default.v2.uploader.upload(req.file.path);
            console.log('Despues de cloudinary');
            product.img = secure_url;
            product.cloudinary_id = public_id;
        }
        const savedProduct = yield product.save();
        return res.status(200).json({
            ok: true,
            savedProduct,
        });
    }
    catch (error) {
        console.log("error en catch----------->", error);
    }
});
// =============================
// EDIT PRODUCT
// =============================
exports.updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    let body = req.body;
    const product = yield Products_1.default.findById(id);
    if (!product) {
        return res.status(400).json({
            ok: false,
            msg: "The ID doesn't exist",
        });
    }
    if (req.file) {
        console.log('Antes de cloudinary');
        yield cloudinary_1.default.v2.uploader.destroy(product.cloudinary_id);
        console.log('Despues de cloudinary');
        const resp = yield cloudinary_1.default.v2.uploader.upload(req.file.path);
        const data = {
            title: req.body.title || product.title,
            category: req.body.category || product.category,
            description: req.body.description || product.description,
            price: req.body.price || product.price,
            img: resp.secure_url || product.img,
            cloudinary_id: resp.public_id || product.cloudinary_id,
        };
        const productUpdated = yield Products_1.default.findByIdAndUpdate(id, data, {
            new: true,
        });
        return res.status(200).json({ ok: true, productUpdated });
    }
    const productUpdated = yield Products_1.default.findByIdAndUpdate(id, body, {
        new: true,
    });
    return res.status(200).json({ ok: true, productUpdated });
});
/**
 * GET ALL PRODUCTS
 */
exports.getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield Products_1.default.find();
    return res.status(200).json(products);
});
/**
 * GET A SINGLE PRODUCT
 */
exports.getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productFound = yield Products_1.default.findById(req.params.id);
    if (!productFound)
        return res.status(204).json({ msg: "Product not found" });
    return res.status(200).json(productFound);
});
/**
 * DELETE PRODUCT
 */
exports.deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //find user
    const productFound = yield Products_1.default.findById(req.params.id);
    //delete image from cloudinary
    if (productFound === null || productFound === void 0 ? void 0 : productFound.img) {
        yield cloudinary_1.default.v2.uploader.destroy(productFound.cloudinary_id);
    }
    //delete user form db
    yield (productFound === null || productFound === void 0 ? void 0 : productFound.remove());
    return res.status(204).json({ ok: true, productFound });
});
/**
 * GET BY CATEGORY
 */
exports.getCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let categoryByRequest = req.params;
    Products_1.default.find(categoryByRequest, (err, productCategory) => {
        if (err)
            return res.status(404).json({ ok: false, err });
        if (productCategory.length < 1)
            return res.status(404).json({ msg: "Unfortunately no products could be found" });
        return res.status(200).json({ ok: true, productCategory });
    });
});
/**
 * GET BY QUERY
 */
exports.getProductBySearch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.query.product) {
        const valueToFind = req.query.product;
        //If the title (from my Product Schema) coincides with the value ($regex), return it. $options: "i" = case unsensitive
        const products = yield Products_1.default.find({ title: { $regex: new RegExp(valueToFind), $options: "i" } });
        if (products.length < 1)
            return res.json({ message: "Unfortunately no products could be found" });
        return res.status(200).json({
            ok: true,
            products
        });
    }
    return res.status(200).json({ ok: true, message: "What are you looking for?" });
});
//# sourceMappingURL=productsControllers.js.map