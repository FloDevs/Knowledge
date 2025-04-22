const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res, next) => {
  if (req.session && req.session.user) return next();

  const sessionId = req.query.session_id;
  if (!sessionId) return res.redirect("/login");

  try {
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
    if (stripeSession?.metadata?.userId) {
      req.session.user = { _id: stripeSession.metadata.userId };
      return next();
    }
  } catch (err) {
    console.error("Erreur récupération session Stripe :", err.message);
  }

  return res.redirect("/login?message=Accès refusé");
};