const Cursus = require("../models/Cursus");
const Lesson = require("../models/Lesson");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.addToCart = async (req, res) => {
  const { id } = req.params;
  const { type } = req.query;

  if (!["cursus", "lesson"].includes(type)) {
    return res.status(400).send("Type d'élément invalide");
  }

  req.session.cart = req.session.cart || [];
  const cart = req.session.cart;

  const alreadyExists = cart.some(
    (item) => item.id === id && item.type === type
  );
  if (alreadyExists) return res.redirect("/cart");

  if (type === "cursus") {
    const relatedLessons = await Lesson.find({ cursus: id }).select("_id");
    const relatedLessonIds = relatedLessons.map((lesson) =>
      lesson._id.toString()
    );

    req.session.cart = cart.filter((item) => {
      return !(item.type === "lesson" && relatedLessonIds.includes(item.id));
    });

    req.session.cart.push({ id, type });
    return res.redirect("/cart");
  }

  if (type === "lesson") {
    const lesson = await Lesson.findById(id).select("cursus");
    if (!lesson) return res.status(404).send("Leçon introuvable");

    const cursusAlreadyInCart = cart.some(
      (item) => item.type === "cursus" && item.id === lesson.cursus.toString()
    );

    if (!cursusAlreadyInCart) {
      req.session.cart.push({ id, type });
    }

    return res.redirect("/cart");
  }
};

exports.removeFromCart = (req, res) => {
  const { id } = req.params;
  const { type } = req.query;

  if (!["cursus", "lesson"].includes(type)) {
    return res.redirect("/cart");
  }

  req.session.cart = (req.session.cart || []).filter(
    (item) => !(item.id === id && item.type === type)
  );

  res.redirect("/cart");
};

exports.showCart = async (req, res) => {
  const cart = req.session.cart || [];

  const cursusIds = cart.filter((i) => i.type === "cursus").map((i) => i.id);
  const lessonIds = cart.filter((i) => i.type === "lesson").map((i) => i.id);

  const cursusList = await Cursus.find({ _id: { $in: cursusIds } });
  const lessonList = await Lesson.find({ _id: { $in: lessonIds } });

  res.render("main/cart", {
    cursusList,
    lessonList,
    pageStylesheet: "main/cart",
  });
};

exports.checkoutCart = async (req, res) => {
  const cart = req.session.cart || [];

  if (!cart.length) return res.redirect("/cart");

  const cursusIds = cart.filter((i) => i.type === "cursus").map((i) => i.id);
  const lessonIds = cart.filter((i) => i.type === "lesson").map((i) => i.id);

  const cursusList = await Cursus.find({ _id: { $in: cursusIds } });
  const lessonList = await Lesson.find({ _id: { $in: lessonIds } });

  const lineItems = [
    ...cursusList.map((c) => ({
      price_data: {
        currency: "eur",
        product_data: { name: `Cursus : ${c.title}` },
        unit_amount: c.price * 100,
      },
      quantity: 1,
    })),
    ...lessonList.map((l) => ({
      price_data: {
        currency: "eur",
        product_data: { name: `Leçon : ${l.title}` },
        unit_amount: l.price * 100,
      },
      quantity: 1,
    })),
  ];

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.DOMAIN}/purchases/success?from=cart&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.DOMAIN}/cart`,
    metadata: {
      userId: req.session.user._id,
      cart: JSON.stringify(cart),
    },
  });

  req.session.cart = []; // vider le panier
  res.redirect(303, session.url);
};
