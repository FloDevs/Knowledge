const express = require("express");
const router = express.Router();
const certificationController = require("../controllers/certificationController");
const { isAdmin } = require("../middlewares");
const { isAuthenticated } = require("../middlewares");

router.get("/", isAuthenticated, isAdmin,certificationController.getAllCertifications);
router.get("/my-certifications",isAuthenticated,certificationController.getUserCertificationsView);
router.get("/download/:cursusId", isAuthenticated, certificationController.downloadCertificate);



module.exports = router;
