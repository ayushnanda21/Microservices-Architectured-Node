//acquirng router
const router = require("express").Router();

//acquiring tokens
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

//acquiring packages
const express = require("express");
const fs = require("fs");
const multer = require("multer");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const excelToJson = require("convert-excel-to-json");
const nodemailer = require("nodemailer");

//models import
const Products = require("../models/Product");
const Users = require("../models/User");

// multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

//integrating SMTP

var email;

//transport function
var transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "",
    pass: "",
  },
});

//routes for uploading
//upload excel file and sending mail
router.post(
  "/uploadfile",
  upload.single("uploadfile"),
  verifyTokenAndAdmin,
  (req, res) => {
    importExcelData2MongoDB(req.file.path);

    email = req.body.email;
    console.log(req.body);
    const message = {
      from: "smtp.mailtrap.io",
      to: email,
      subject: "Single req",
      text: "Working successfully",
    };

    transport.sendMail(message, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Mail sent" + info.response);
      }
    });

    res.status(200).json({
      msg: "File imported to database successfully",
      file: req.file,
    });
  }
);

// Import Excel File to MongoDB database
async function importExcelData2MongoDB(filePath) {
  // -> Read Excel File to Json Data
  const excelData = excelToJson({
    sourceFile: filePath,
    sheets: [
      {
        // Excel Sheet Name
        name: "Sheet1",
        // Header Row -> be skipped and will not be present at our result object.
        header: {
          rows: 1,
        },
        // Mapping columns to keys
        columnToKey: {
          A: "name",
          B: "description",
          C: "richDescription",
          D: "image",
          E: "images",
          F: "brand",
          G: "price",
          H: "category",
          I: "countInStock",
          J: "rating",
          K: "numReviews",
          L: "isFeatured",
          M: "createdAt",
          N: "updatedAt",
        },
      },
    ],
  });
  // -> Log Excel Data to Console
  console.log(filePath);
  console.log(excelData);

  //Insert jsonobject to mongodb
  try {
    await Products.insertMany(excelData.Sheet1);
    console.log("Inserted successfully");
  } catch (err) {
    console.log(err);
  }
}

module.exports = router;
