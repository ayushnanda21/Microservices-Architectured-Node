//acquirng router
const router = require("express").Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const UserController = require("../controllers/userController");

//register user
router.post("/register", UserController.userRegister);

//login user
router.post("/login", UserController.userLogin);

//get user by id
router.get("/:id", UserController.getUserById);

//get all users
router.get("/", UserController.getallUsers);

//delete user
router.delete("/:id", UserController.deleteUser);

//update user
router.put("/:id", UserController.updateUser);

//count of users
router.get("/get/count", UserController.getUserCount);

module.exports = router;
