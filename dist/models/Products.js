"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    title: {
        type: String,
        trim: true,
    },
    category: {
        type: String,
        trim: true,
        lowercase: true,
    },
    description: {
        type: String,
        trim: true,
    },
    img: {
        type: String,
        trim: true,
    },
    cloudinary_id: {
        type: String,
        trim: true,
    },
    price: {
        type: Number,
    },
}, {
    versionKey: false,
    timestamps: true,
});
exports.default = mongoose_1.model("Product", productSchema);
//# sourceMappingURL=Products.js.map