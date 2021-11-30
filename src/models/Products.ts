import { Schema, model, Document } from "mongoose";

export interface IProduct extends Document {
	title: string; //lowercase because is typescript not mongoose
	category: string;
	description: string;
	img: string;
	cloudinary_id: string;
	price: number;
}
const productSchema = new Schema(
	{
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
	},
	{
		versionKey: false,
		timestamps: true,
	}
);

export default model<IProduct>("Product", productSchema);
