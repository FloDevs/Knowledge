const express = require("express");
const router = express.Router();
const userController = require ("../controllers/userController");
const { isAdmin } = require("../middlewares");
const { isAuthenticated } = require("../middlewares");

router.get("/",isAuthenticated, isAdmin, userController.getAllUsers);

router.get("/profile", isAuthenticated, userController.getMyProfile);

router.post('/update-password', isAuthenticated, userController.updatePassword);

router.put("/update/:id", isAuthenticated, userController.updateUser);

router.delete("/delete/:id", isAuthenticated, isAdmin, userController.deleteUser);

module.exports = router;
