const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progressController");
const { isAuthenticated } = require("../middlewares");

router.post("/complete-lesson",isAuthenticated,progressController.markLessonCompleted);
router.get("/cursus/:cursusId",isAuthenticated,progressController.getCursusProgress);

module.exports = router;
