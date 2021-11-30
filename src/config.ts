//this tow lines execute de .env file
import dotenv from "dotenv";
dotenv.config();

export default {
	jwtSecret: process.env.SECRET_KEY || "tokenTest",
	DB: {
		URI: process.env.DB_CONNECTION || "connection",
	},
};
