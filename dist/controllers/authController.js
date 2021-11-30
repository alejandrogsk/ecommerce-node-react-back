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
exports.profile = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
exports.register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.email)
        return res.status(400).json({ ok: false, message: "Email is required" });
    if (!req.body.password)
        return res.status(400).json({ ok: false, message: "Password is required" });
    if (!req.body.name)
        return res.status(400).json({ ok: false, message: "Name is required" });
    const { email } = req.body;
    //find user
    const findUser = yield User_1.default.findOne({ email });
    //if user exist send an error
    if (findUser) {
        return res.status(400).json({ ok: false, message: "User already exist" });
    }
    const user = new User_1.default(req.body);
    //encrypt password before saving it on database
    user.password = yield user.encryptPassword(user.password);
    const savedUser = yield user.save();
    //token
    const token = jsonwebtoken_1.default.sign({ id: savedUser.id }, config_1.default.jwtSecret || "tokenTest");
    return res.status(201).header("x-token", token).json({
        ok: true,
        user,
        token,
    });
});
exports.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.email)
        return res.status(400).json({ ok: false, message: "Email is required" });
    if (!req.body.password)
        return res.status(400).json({ ok: false, message: "Password is required" });
    const user = yield User_1.default.findOne({ email: req.body.email });
    if (!user)
        return res.status(400).json({
            ok: false,
            message: "User doesn't exist"
        });
    const isMatch = yield user.validatePassword(req.body.password);
    //user not found
    if (!isMatch) {
        return res.status(400).json({
            ok: false,
            message: "Incorrect password",
        });
    }
    //Generate Token
    //token
    const token = jsonwebtoken_1.default.sign({ id: user.id }, config_1.default.jwtSecret || "tokenTest", { expiresIn: 86400 });
    return res.status(200).header("x-token", token).json({
        ok: true,
        user,
        token,
    });
});
exports.profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header("x-token");
    //where does userID come from? verifyToken
    const user = yield User_1.default.findById(req.userId);
    if (!user)
        return res.status(400).json({
            ok: false,
            message: "User doesn't exist"
        });
    return res.json({
        ok: true,
        user,
        token
    });
});
//# sourceMappingURL=authController.js.map