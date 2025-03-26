const express = require("express");
const router = express.Router();
const cursusController = require("../controllers/cursusController");

// CRUD (admin)
router.post("/", auth, isAdmin,cursusController.createCursus);
router.get("/", cursusController.getAllCursus);
router.get("/:id", cursusController.getCursusById);
router.put("/:id", auth, isAdmin,cursusController.updateCursus);
router.delete("/:id",auth, isAdmin,cursusController.deleteCursus);

module.exports = router;
