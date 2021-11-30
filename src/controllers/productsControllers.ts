import { RequestHandler } from "express";
import Product, { IProduct } from "../models/Products";

import cloudinary from "../libs/cloudinary";
/**
 * CREATE PRODUCT
 */
export const createProduct: RequestHandler = async (req, res) => {
		const { title, category, description, price } = req.body;

		const productFound = await Product.findOne({ title });
		if (productFound) {
			return res.status(301).json({ msg: "This product already exists" });
		}

		//console.log(req.file);
		//const img = req.file.path;

		const product: IProduct = new Product({
			title,
			category,
			description,
			price,
		});

		//req.file exists thanks to multer
		try {
			if (req.file) {
				console.log('Antes de cloudinary')
				const { secure_url, public_id } = await cloudinary.v2.uploader.upload(
					req.file.path
				);
				console.log('Despues de cloudinary')
				product.img = secure_url;
				product.cloudinary_id = public_id;
			}
	
			const savedProduct = await product.save();
	
			return res.status(200).json({
				ok: true,
				savedProduct,
			});
		} catch (error) {
			console.log("error en catch----------->", error)
		}
};

// =============================
// EDIT PRODUCT
// =============================
export const updateProduct: RequestHandler = async (req, res) => {
	
		let id = req.params.id;
		let body = req.body;

		const product = await Product.findById(id);

		if (!product) {
			return res.status(400).json({
				ok: false,
				msg: "The ID doesn't exist",
			});
		}

		if (req.file) {

			console.log('Antes de cloudinary')
			await cloudinary.v2.uploader.destroy(product.cloudinary_id);
			console.log('Despues de cloudinary')
			const resp = await cloudinary.v2.uploader.upload(req.file.path);

			const data = {
				title: req.body.title || product.title,
				category: req.body.category || product.category,
				description: req.body.description || product.description,
				price: req.body.price || product.price,
				img: resp.secure_url || product.img,
				cloudinary_id: resp.public_id || product.cloudinary_id,
			};

			const productUpdated = await Product.findByIdAndUpdate(id, data, {
				new: true,
			});

			return res.status(200).json({ ok: true, productUpdated });
		}

		const productUpdated = await Product.findByIdAndUpdate(id, body, {
			new: true,
		});

		return res.status(200).json({ ok: true, productUpdated });

};

/**
 * GET ALL PRODUCTS
 */
export const getProducts: RequestHandler = async (req, res) => {

	const products = await Product.find();
	return res.status(200).json(products);

};

/**
 * GET A SINGLE PRODUCT
 */
export const getProduct: RequestHandler = async (req, res) => {

	const productFound = await Product.findById(req.params.id);

	if (!productFound)
		return res.status(204).json({ msg: "Product not found" });

	return res.status(200).json(productFound);

};

/**
 * DELETE PRODUCT
 */
export const deleteProduct: RequestHandler = async (req, res) => {

	//find user
	const productFound = await Product.findById(req.params.id);

	//delete image from cloudinary
	if (productFound?.img) {
		await cloudinary.v2.uploader.destroy(productFound.cloudinary_id);
	}

	//delete user form db
	await productFound?.remove();

	return res.status(204).json({ok: true, productFound});

};

/**
 * GET BY CATEGORY
 */

export const getCategory: RequestHandler = async (req, res) => {

	let categoryByRequest = req.params;

	Product.find(categoryByRequest, (err, productCategory) => {
		if (err) return res.status(404).json({ok:false, err});

		if (productCategory.length < 1) return res.status(404).json({ msg: "Unfortunately no products could be found" });

		return res.status(200).json({ok: true, productCategory});
	});
};


/**
 * GET BY QUERY 
 */
export const getProductBySearch: RequestHandler = async (req, res) => {
	if (req.query.product) {

		const valueToFind = req.query.product;
		//If the title (from my Product Schema) coincides with the value ($regex), return it. $options: "i" = case unsensitive
		const products = await Product.find({ title: { $regex: new RegExp(valueToFind as string), $options: "i" }});

		if (products.length < 1) return res.json({message: "Unfortunately no products could be found"});	

		return res.status(200).json({
			ok: true, 
			products
		});		
	}
	return res.status(200).json({ok: true, message: "What are you looking for?"});
}