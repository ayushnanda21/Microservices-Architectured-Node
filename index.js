require('dotenv').config()
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");

//acquiring routes
const productRoute = require("./routes/products");
const userRoute = require("./routes/users");
const orderRoute = require("./routes/orders");
const categoriesRoute = require("./routes/categories");
const excelImporRoute =  require("./routes/excelimport");

const app = express();
app.use(cors());
app.options("*", cors());

const api = process.env.API_URL
//http://localhost:5000/api/v1/products

//middlewares
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(helmet());
app.use(morgan("tiny"));
//app.use(express.static('./public'));
//app.use(authJwt());


app.use("/api/v1/products", productRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/categories", categoriesRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/uploading", excelImporRoute);

module.exports = app;