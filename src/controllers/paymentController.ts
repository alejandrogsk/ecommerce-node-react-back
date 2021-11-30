import { RequestHandler } from "express";

const Stripe = require('stripe');
//start stripe
const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`);

const checkout:RequestHandler =  async(req, res) => {

    try {
        const { amount, id } = req.body;
        console.log("DATA, REQUERIDA", amount, id)
        //podria recibir el id del producto, buscarlo en la base de datos y escribir la descripción así
        //mas documentacion a respecto { https://stripe.com/docs/billing/subscriptions/multiple }, { https://stripe.com/docs/billing/subscriptions/quantities }
        const payment = await stripe.paymentIntents.create({
            amount,
            currency: "USD",
            description: "Description",
            payment_method: id,
            confirm: true
        });
        console.log('SUCCESS', payment)
        res.json({ ok: true, message: "The payment was made successfully" });
    }
    catch (error) {
        console.log("ERROR EN CATCH", error);
        res.json(error);
    }
}

export default checkout;