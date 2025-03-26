const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progressController");

// Marquer leçon comme terminée
router.post("/complete-lesson",auth,progressController.markLessonCompleted);

// Récupérer la progression sur un cursus
router.get("/cursus/:cursusId",auth,progressController.getCursusProgress);

module.exports = router;
