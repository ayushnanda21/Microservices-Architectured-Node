//acquiring model
const Category = require("../models/Category");
//acquirng router
const router = require("express").Router();

const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

//add category
const categoriesController = require("../controllers/categoriesController");

router.post("/", categoriesController.createCategory);

//update category
router.put("/:id", categoriesController.updateCategory);

//delete category

router.delete("/:id", categoriesController.deleteCategory);

//get category list
router.get("/", categoriesController.getallCategories);

//get particular category by id
router.get("/:id", categoriesController.getcategorybyId);

module.exports = router;
