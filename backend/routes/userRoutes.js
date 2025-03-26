const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Routes publiques
router.post("/register", userController.register);
router.post("/login", userController.login);

router.get("/",auth, isAdmin,userController.getAllUsers);
router.get("/:id",auth,userController.getUserById);
router.put("/:id", auth,userController.updateUser);
router.delete("/:id", auth, isAdmin,userController.deleteUser);

module.exports = router;
