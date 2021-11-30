import { NextFunction, Request, Response } from "express-serve-static-core";
import User from "../models/User";

export const verifyRole = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	//req.usuario porque previamente verificamos el token y lo establecimos así
	let { userId } = req;
	console.log(userId);

	await User.findById(userId, (err, user) => {
		if (user?.role === "ADMIN_ROLE") {
			next();
		} else {
			return res.status(401).json({
				ok: false,
				err: {
					message: "The user should be an administrator",
				},
			});
		}
	});
};
