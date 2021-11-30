import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import jwt from "jsonwebtoken";

import config from "../config";

export const register = async (req: Request, res: Response) => {
	if(!req.body.email) return res.status(400).json({ ok: false, message: "Email is required" });
	if(!req.body.password) return res.status(400).json({ ok: false, message: "Password is required" });
	if(!req.body.name) return res.status(400).json({ ok: false, message: "Name is required" });
	

	const { email } = req.body;
	
	//find user
	const findUser = await User.findOne({ email });
	//if user exist send an error
	if (findUser) {
		return res.status(400).json({ ok: false, message: "User already exist" });
	}

	const user: IUser = new User(req.body);

	//encrypt password before saving it on database
	user.password = await user.encryptPassword(user.password);

	const savedUser = await user.save();
	//token
	const token: string = jwt.sign(
		{ id: savedUser.id },
		config.jwtSecret || "tokenTest"
	);

	return res.status(201).header("x-token", token).json({
		ok: true,
		user,
		token,
	});
};

export const login = async (req: Request, res: Response) => {
	if(!req.body.email) return res.status(400).json({ ok: false, message: "Email is required" });
	if(!req.body.password) return res.status(400).json({ ok: false, message: "Password is required" });
	

	const user = await User.findOne({ email: req.body.email });

	if (!user) return res.status(400).json({ 
		ok: false, 
		message: "User doesn't exist" 
	});

	const isMatch = await user.validatePassword(req.body.password);

	//user not found
	if (!isMatch) {
		return res.status(400).json({
			ok: false,
			message: "Incorrect password",
		});
	}

	//Generate Token
	//token
	const token: string = jwt.sign(
		{ id: user.id },
		config.jwtSecret || "tokenTest",
		{ expiresIn: 86400 }
	);

	return res.status(200).header("x-token", token).json({
		ok: true,
		user,
		token,
	});
};

export const profile = async (req: Request, res: Response) => {
	const token = req.header("x-token");

	//where does userID come from? verifyToken
	const user = await User.findById(req.userId);

	if (!user) return res.status(400).json({ 
		ok: false, 
		message: "User doesn't exist" 
	});

	return res.json({
		ok: true,	
		user,
		token
	});
};
