const cookieParser = require("cookie-parser");
const express = require("express");
const dotenv = require("dotenv");
const app = express();

app.use(express.json());
app.use(cookieParser());

// config
dotenv.config({ path: "./backend/./config/config.env" });

// router
app.use("/api/v1", require("./router/productRouter"));
app.use("/api/v1", require("./router/userRouter"));
app.use("/api/v1", require("./router/orderRouter"));

// middleware
app.use(require("./middleware/error"));

module.exports = app;
