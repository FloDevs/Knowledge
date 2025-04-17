const Purchase = require("../models/Purchase");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Cursus = require("../models/Cursus");
const Lesson = require("../models/Lesson");

// CREATE PURCHASE
exports.createPurchase = async (req, res) => {
  try {
    const { userId } = req; // supposons que le middleware auth place req.userId
    const { cursusId, lessonId } = req.body;

    // Vérification : cursusId OU lessonId doit être défini
    if (!cursusId && !lessonId) {
      return res.status(400).json({ message: "Cursus or Lesson required" });
    }

    const newPurchase = await Purchase.create({
      user: userId,
      cursus: cursusId || null,
      lesson: lessonId || null,
    });

    res.status(201).json(newPurchase);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL PURCHASES (Admin)
exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({})
      .populate("user")
      .populate("cursus")
      .populate("lesson");
      res.render("admin/orders", { orders : purchases});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET PURCHASES BY USER
exports.getUserPurchases = async (req, res) => {
  try {
    const { userId } = req; // from auth
    const userPurchases = await Purchase.find({ user: userId })
      .populate("cursus")
      .populate("lesson");
    res.json(userPurchases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




exports.createStripeSession = async (req, res) => {
  const { type, id } = req.params;

  if (!req.session.user || !req.session.user._id) {
    console.log("❌ Aucune session utilisateur !");
    return res.status(401).render("error", {
      message: "Utilisateur non connecté.",
    });
  }

  const userId = req.session.user._id;

  try {
    let item, price, name;

    if (type === "cursus") {
      item = await Cursus.findById(id);
      if (!item) {
        return res.status(404).render("error", {
          message: "Cursus introuvable.",
        });
      }
      price = item.price * 100;
      name = `Cursus : ${item.title}`;
    } else if (type === "lesson") {
      item = await Lesson.findById(id);
      if (!item) {
        return res.status(404).render("error", {
          message: "Leçon introuvable.",
        });
      }
      price = item.price * 100;
      name = `Leçon : ${item.title}`;
    } else {
      return res.status(400).render("error", {
        message: "Type d'achat invalide.",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.DOMAIN}/purchases/success?session_id={CHECKOUT_SESSION_ID}&type=${type}&id=${id}`,
      cancel_url: `${process.env.DOMAIN}/${type}/${id}`,
      metadata: {
        userId: String(userId),
      },
    });

    res.redirect(303, session.url);
  } catch (err) {
    console.error("❌ Erreur création session Stripe :", err);
    res.status(500).render("error", {
      message: "Erreur lors du paiement",
      error: err,
    });
  }
};



exports.confirmPurchase = async (req, res) => {
  // On vérifie que l'utilisateur est connecté
  if (!req.session.user || !req.session.user._id) {
    return res.status(401).render("error", {
      message: "Utilisateur non connecté.",
    });
  }

  // Récupère l'id user, plus les infos du query
  const userId = req.session.user._id;
  const { type, id } = req.query;

  try {
    // Vérifie si on a déjà un achat pour ce user et ce cursus/leçon
    const already = await Purchase.findOne({ user: userId, [type]: id });

    if (!already) {
      // Crée l'achat si inexistant
      await Purchase.create({ user: userId, [type]: id });
    }

    // Rend la page de confirmation
    res.render("purchase/purchase-success", { type, id });
  } catch (err) {
    console.error("❌ Erreur lors de l'enregistrement de l'achat :", err);
    res.status(500).render("purchase/purchase-cancel", {
      message: "Erreur lors de la validation de l'achat",
      error: err,
    });
  }
};