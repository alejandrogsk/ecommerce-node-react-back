import mongoose, { ConnectionOptions } from "mongoose";
import config from "./config";

(async () => {
	try {
		const mongooseOptions: ConnectionOptions = {
			useUnifiedTopology: true,
			useNewUrlParser: true,
			useCreateIndex: true,
		};

		const db = await mongoose.connect(config.DB.URI, mongooseOptions);
		console.log("database is connected to: ", db.connection.name);
	} catch (error) {
		console.log(error);
	}
})();
