const express = require("express");
const router = express.Router();
const cursusController = require("../controllers/cursusController");
const { isAdmin } = require("../middlewares");
const { isAuthenticated } = require("../middlewares");

// CRUD (admin)
router.get("/dashboard", isAuthenticated, cursusController.getMyCursus);
router.get("/", cursusController.getAllCursus);
router.post("/create", isAuthenticated, isAdmin,cursusController.createCursus);
router.get("/:id", cursusController.getCursusById);
router.put("/update/:id", isAuthenticated, isAdmin,cursusController.updateCursus);
router.delete("/delete/:id",isAuthenticated, isAdmin,cursusController.deleteCursus);

module.exports = router;
