const Product = require("../models/Product");
const Category = require("../models/Category");
const path = require("path");
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

exports.createProduct = async (req, res) => {
  // to check if this category exist in db or not
  const category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(400).json("Invalid Category");
  }

  //if no image uploaded
  const file = req.file;
  if (!file) {
    return res.status(400).json("No image attached");
  }

  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  const newProduct = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: `${basePath}${fileName}`,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });

  try {
    const savedProduct = await newProduct.save();
    if (!savedProduct) {
      res.status(404).json({
        status: "false",
        message: "Product can't be created",
      });
    } else {
      res.status(201).json(savedProduct);
    }
  } catch (err) {
    res.status(500).json({
      error: err,
      success: false,
    });
  }
};

exports.updateProduct = async (req, res) => {
  //id validation
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json("Invalid id");
  }
  // to check if this category exist in db or not
  const category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(400).json("Invalid Category");
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(400).json("Invalid Product");
  }

  const file = req.file;
  let imagepath;

  if (file) {
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    imagepath = `${basePath}${fileName}`;
  } else {
    imagepath = product.image;
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    if (!updatedProduct) {
      res.status(400).json({
        status: false,
        message: "Product doesnt exist",
      });
    } else {
      res.status(200).json({
        data: updatedProduct,
        success: true,
        message: "Successfully updated",
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getallProducts = async (req, res) => {
  //localhost:5000/api/v1/products?categories=761354,659433
  try {
    let filter = {};
    if (req.query.categories) {
      filter = { category: req.query.categories.split(",") };
    }
    const productList = await Product.find(filter)
      .select("name image -_id")
      .populate("category");
    if (!productList) {
      res.status(404).json({
        status: false,
        message: "Cant' get all products",
      });
    } else {
      res.status(200).json({
        data: productList,
        message: "All products fetching success",
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");

  try {
    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product you requested doesn't exist",
      });
    } else {
      res.status(200).json({
        data: product,
        success: true,
        message: "Product found",
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findById(req.params.id);
    if (!deletedProduct) {
      res.status(404).json({
        success: false,
        message: "Product doesn't exist",
      });
    } else {
      await deletedProduct.deleteOne();
      res.status(200).json({
        success: true,
        message: "Product successfully deleted",
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getProductCount = async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    if (!productCount) {
      res.status(400).json({
        success: false,
        message: "Count error!",
      });
    } else {
      res.status(200).json("Product count is : " + productCount);
    }
  } catch (err) {
    res.status(500).json({
      error: err,
      success: false,
    });
  }
};

exports.getFeaturedProducts = async (req, res) => {
  try {
    const count = req.params.count ? req.params.count : 0;
    const productFeatured = await Product.find({ isFeatured: true }).limit(
      +count
    );
    if (!productFeatured) {
      res.status(400).json("Not featured");
    } else {
      res.status(200).json({
        data: productFeatured,
        success: true,
        message: "Feautured product",
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateGalleryImages = async (req, res) => {
  //id validation
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json("Invalid id");
  }
  const files = req.files;
  let imagesPaths = [];
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  if (files) {
    files.map((file) => {
      imagesPaths.push(`${basePath}${file.fileName}`);
    });
  }

  try {
    const updaproduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        images: imagesPaths,
      },
      { new: true }
    );

    if (!updaproduct) {
      res.status(400).json("ERROR! Images edit not completed!");
    } else {
      res.status(200).json(updaproduct);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
