import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
	name: string; //lowercase because is typescript not mongoose
	email: string;
	password: string;
	role: string;
	encryptPassword: (password: string) => Promise<string>;
	validatePassword: (password: string) => Promise<boolean>;
}
//Puede que esto de error
let rolesValidos = {
	values: ["ADMIN_ROLE", "USER_ROLE"],
	message: "{VALUE} no es un rol valido",
};

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		min: 4,
		lowercase: true,
	},
	email: {
		type: String,
		unique: true,
		required: true,
		lowercase: true,
		trim: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		default: "USER_ROLE",
		enum: rolesValidos,
	},
});

//Encrypting the password before saving it
userSchema.methods.encryptPassword = async (
	password: string
): Promise<string> => {
	const salt = await bcrypt.genSalt(10);
	return bcrypt.hash(password, salt);
};

//Validating password
userSchema.methods.validatePassword = async function (
	password: string
): Promise<boolean> {
	return await bcrypt.compare(password, this.password);
};

export default model<IUser>("User", userSchema);
