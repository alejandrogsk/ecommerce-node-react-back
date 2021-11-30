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
Object.defineProperty(exports, "__esModule", { value: true });
const Stripe = require('stripe');
//start stripe
const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`);
const checkout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, id } = req.body;
        console.log("DATA, REQUERIDA", amount, id);
        //podria recibir el id del producto, buscarlo en la base de datos y escribir la descripción así
        //mas documentacion a respecto { https://stripe.com/docs/billing/subscriptions/multiple }, { https://stripe.com/docs/billing/subscriptions/quantities }
        const payment = yield stripe.paymentIntents.create({
            amount,
            currency: "USD",
            description: "Description",
            payment_method: id,
            confirm: true
        });
        console.log('SUCCESS', payment);
        res.json({ ok: true, message: "The payment was made successfully" });
    }
    catch (error) {
        console.log("ERROR EN CATCH", error);
        res.json(error);
    }
});
exports.default = checkout;
//# sourceMappingURL=paymentController.js.map