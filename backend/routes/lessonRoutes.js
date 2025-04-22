const express = require("express");
const router = express.Router();
const lessonController = require("../controllers/lessonController");
const { isAdmin } = require("../middlewares");
const { isAuthenticated } = require("../middlewares");

router.post("/create", isAuthenticated, isAdmin, lessonController.createLesson);
router.get("/:id", isAuthenticated, lessonController.getLessonViewById);
router.put(
  "/update/:id",
  isAuthenticated,
  isAdmin,
  lessonController.updateLesson
);
router.delete(
  "/delete/:id",
  isAuthenticated,
  isAdmin,
  lessonController.deleteLesson
);

module.exports = router;
