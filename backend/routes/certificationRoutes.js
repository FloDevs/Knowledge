const express = require("express");
const router = express.Router();
const certificationController = require("../controllers/certificationController");
const { isAdmin } = require("../middlewares");
const { isAuthenticated } = require("../middlewares");

// ADMIN : Récupérer toutes les certifications
router.get("/", isAuthenticated, isAdmin,certificationController.getAllCertifications);

// USER : Récupérer ses certifications
router.get("/my-certifications",isAuthenticated,certificationController.getUserCertifications);

router.get("/certifications/mes-certificats", isAuthenticated, certificationController.getUserCertificationsView);


module.exports = router;
