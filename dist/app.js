"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const cors = require('cors');
const auth_1 = __importDefault(require("./routes/auth"));
const products_1 = __importDefault(require("./routes/products"));
const payment_1 = __importDefault(require("./routes/payment"));
const app = express_1.default();
//Create the port
app.set("port", process.env.PORT || 4000);
//prevent cors error
app.use(cors());
//middlewares
//Is a development aid
app.use(morgan_1.default("dev"));
//understand json objects
app.use(express_1.default.json());
//understand the fields of a form that come per POST
app.use(express_1.default.urlencoded({ extended: false }));
//for img uploads
app.use("/public", express_1.default.static(path_1.default.join(__dirname + "./storage")));
//Routes
app.use("/api/auth", auth_1.default);
app.use("/api", products_1.default);
app.use("/api", payment_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map