const express = require("express");
const router = express.Router();
const purchaseController = require("../controllers/purchaseController");

// CRÉER UN ACHAT
router.post("/", /*auth,*/ purchaseController.createPurchase);

// ADMIN - GET TOUT
router.get("/", /*auth, isAdmin,*/ purchaseController.getAllPurchases);

// RÉCUPÉRER ACHATS UTILISATEUR
router.get("/my-purchases",auth,purchaseController.getUserPurchases);

module.exports = router;
