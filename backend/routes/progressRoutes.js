const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progressController");
const { isAuthenticated } = require("../middlewares");


// Marquer leçon comme terminée
router.post("/complete-lesson",isAuthenticated,progressController.markLessonCompleted);

// Récupérer la progression sur un cursus
router.get("/cursus/:cursusId",isAuthenticated,progressController.getCursusProgress);

module.exports = router;
