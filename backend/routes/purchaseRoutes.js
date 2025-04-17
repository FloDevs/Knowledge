const express = require("express");
const router = express.Router();
const purchaseController = require("../controllers/purchaseController");
const { isAdmin } = require("../middlewares");
const { isAuthenticated } = require("../middlewares");
const allowIfStripeSuccess = require("../middlewares/allowIfStripeSuccess");

// CRÉER UN ACHAT
router.post("/", isAuthenticated, purchaseController.createPurchase);

// ADMIN - GET TOUT
router.get("/",isAuthenticated, isAdmin, purchaseController.getAllPurchases);

// RÉCUPÉRER ACHATS UTILISATEUR
router.get("/my-purchases",isAuthenticated,purchaseController.getUserPurchases);

router.get("/buy/:type/:id", isAuthenticated, purchaseController.createStripeSession);
router.get("/success", allowIfStripeSuccess, purchaseController.confirmPurchase);
router.get("/cancel", isAuthenticated, (req, res) => {
    res.render("purchase/purchase-cancel");
  });

module.exports = router;
