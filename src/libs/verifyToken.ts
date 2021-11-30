import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface IPayload {
	id: string;
	iat: number;
	exp: number;
}

export const TokenValidator = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const token = req.header("x-token");
		if (!token) return res.json({ok:false, message:"Access denied, you should authenticate"});

		const payload = jwt.verify(
			token,
			process.env.SECRET_KEY || "tokenTest"
		) as IPayload;

		/**
		 * for userId to work it was necessary to configure the types.d.ts
		 * file and also add it to the end of the tsconfig.json file
		 */
		req.userId = payload.id;
		

		next();
	} catch (err) {
		res.json({ ok: false, message: "token is required" });
	}
};
