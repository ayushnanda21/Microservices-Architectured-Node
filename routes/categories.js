//acquiring model
const Category = require("../models/Category");
//acquirng router
const router = require("express").Router();

const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
  } = require("./verifyToken");

//add category
const CategoriesController = require("../controllers/categoriesController");

router.post("/" , CategoriesController.createCategory);

//update category
router.put("/:id", CategoriesController.updateCategory );

//delete category

router.delete("/:id", CategoriesController.deleteCategory );


//get category list
router.get("/", CategoriesController.getallCategories );

//get particular category by id
router.get("/:id", CategoriesController.getCategoryById);



module.exports = router