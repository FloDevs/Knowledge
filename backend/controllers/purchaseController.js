const Purchase = require("../models/Purchase");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Cursus = require("../models/Cursus");
const Lesson = require("../models/Lesson");

exports.createPurchase = async (req, res) => {
  try {
    const userId = req.session?.user?._id;
    const { cursusId, lessonId } = req.body;

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

exports.getAllPurchases = async () => {
  const purchases = await Purchase.find({})
    .populate("user")
    .populate("cursus")
    .populate("lesson");
  return purchases;
};

exports.getUserPurchases = async (req, res) => {
  try {
    const userId = req.session?.user?._id;
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
  if (!req.session.user || !req.session.user._id) {
    return res
      .status(401)
      .render("error", { message: "Utilisateur non connecté." });
  }

  const userId = req.session.user._id;
  const { type, id, from, session_id } = req.query;

  try {
    if (from === "cart" && session_id) {
      // Retrieve the Stripe metadata (containing the full list)
      const session = await stripe.checkout.sessions.retrieve(session_id);
      const items = JSON.parse(session.metadata.cart || "[]");

      for (const item of items) {
        const already = await Purchase.findOne({
          user: userId,
          [item.type]: item.id,
        });
        if (!already) {
          await Purchase.create({ user: userId, [item.type]: item.id });
        }
      }

      return res.render("purchase/purchase-success", {
        type: "panier",
        id: null,
        pageStylesheet: "purchase/purchase",
      });
    }

    const already = await Purchase.findOne({ user: userId, [type]: id });
    if (!already) {
      await Purchase.create({ user: userId, [type]: id });
    }

    res.render("purchase/purchase-success", {
      type,
      id,
      pageStylesheet: "purchase/purchase",
    });
  } catch (err) {
    console.error("❌ Erreur lors de l'enregistrement de l'achat :", err);
    res.status(500).render("purchase/purchase-cancel", {
      message: "Erreur lors de la validation de l'achat",
      error: err,
      pageStylesheet: "purchase/purchase",
    });
  }
};
