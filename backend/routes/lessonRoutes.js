const express = require("express");
const router = express.Router();
const lessonController = require("../controllers/lessonController");

// CRUD (admin)
router.post("/", auth, isAdmin,lessonController.createLesson);
router.get("/", lessonController.getAllLessons);
router.get("/:id", lessonController.getLessonById);
router.put("/:id", auth, isAdmin,lessonController.updateLesson);
router.delete("/:id",auth, isAdmin,lessonController.deleteLesson);

module.exports = router;
