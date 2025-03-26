const express = require("express");
const router = express.Router();
const themeController = require("../controllers/themeController");

// CRUD (admin)
router.post("/", auth, isAdmin,themeController.createTheme);
router.get("/", themeController.getAllThemes);
router.get("/:id", themeController.getThemeById);
router.put("/:id", auth, isAdmin,themeController.updateTheme);
router.delete("/:id",auth, isAdmin,themeController.deleteTheme);

module.exports = router;
