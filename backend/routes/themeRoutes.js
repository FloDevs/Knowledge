const express = require("express");
const router = express.Router();
const themeController = require("../controllers/themeController");
const { isAdmin } = require("../middlewares");
const { isAuthenticated } = require("../middlewares");


// CRUD (admin)
router.post("/create", isAuthenticated, isAdmin,themeController.createTheme);
router.get("/", themeController.getAllThemes);
router.get("/:id", themeController.getThemeById);
router.put("/update/:id", isAuthenticated, isAdmin,themeController.updateTheme);
router.delete("/delete/:id",isAuthenticated, isAdmin,themeController.deleteTheme);

module.exports = router;
