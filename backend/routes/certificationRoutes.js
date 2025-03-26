const express = require("express");
const router = express.Router();
const certificationController = require("../controllers/certificationController");

// ADMIN : Récupérer toutes les certifications
router.get("/", auth, isAdmin,certificationController.getAllCertifications);

// USER : Récupérer ses certifications
router.get("/my-certifications",auth,certificationController.getUserCertifications);

module.exports = router;
