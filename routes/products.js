//acquiring model
const Product = require("../models/Product");
const Category = require("../models/Category");
const mongoose = require("mongoose");
const path = require("path");

//acquirng router
const router = require("express").Router();
const ProductController = require("../controllers/productController");

const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const multer = require("multer");

//image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.replace(" ", "-");
    //creating extension
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
});

//add new product
router.post(
  "/",
  uploadOptions.single("image"),
  ProductController.createProduct
);

//update product
router.put(
  "/:id",
  uploadOptions.single("image"),
  ProductController.createProduct
);

//get all products +  query parameter passing for categories
router.get("/", ProductController.getallProducts);

//get particular product by id
router.get("/:id", ProductController.getProductById);

//delete products
router.delete("/:id", ProductController.deleteProduct);

//count of products in db
router.get("/get/count", ProductController.getProductCount);

// getting featured products
router.get("/get/featured/:count", ProductController.getFeaturedProducts);

//updating /adding gallery images for product endpoint
router.put(
  "/gallery-image/:id",
  verifyTokenAndAdmin,
  uploadOptions.array("images", 10),
  ProductController.updateGalleryImages
);

module.exports = router;
