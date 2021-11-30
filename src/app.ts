import express from "express";
import morgan from "morgan";
import path from "path";
const cors = require('cors')


import authRoutes from "./routes/auth";
import produtRoutes from "./routes/products";
import paymentRoutes from "./routes/payment";

const app = express();




//Create the port
app.set("port", process.env.PORT || 4000);

//prevent cors error
app.use(cors())

//middlewares
//Is a development aid
app.use(morgan("dev"));
//understand json objects
app.use(express.json());

//understand the fields of a form that come per POST
app.use(express.urlencoded({ extended: false }));

//for img uploads
app.use("/public", express.static(path.join(__dirname + "./storage")));

//Routes
app.use("/api/auth", authRoutes);
app.use("/api", produtRoutes);
app.use("/api", paymentRoutes)

export default app;
