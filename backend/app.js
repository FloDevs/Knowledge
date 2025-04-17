const express = require('express');
const path = require("path");
const cors = require('cors');
const session = require("express-session");
const helmet = require("helmet");
const methodOverride = require('method-override');
require('dotenv').config();

const Cursus = require("./models/Cursus");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const themeRoutes = require("./routes/themeRoutes");
const cursusRoutes = require("./routes/cursusRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const progressRoutes = require("./routes/progressRoutes");
const certificationRoutes = require("./routes/certificationRoutes");
const adminRoutes = require('./routes/adminRoutes');


const {
  logger,
  setUserLocals,
  sanitizeInputs,
  csrfProtection
} = require("./middlewares");

const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      formAction: ["'self'", "https://checkout.stripe.com"],
    }
  }
}));


app.set("trust proxy", false);
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallbackSecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,           // tu es en HTTP → doit rester false
      httpOnly: true,
      sameSite: "lax",         // ← essentiel pour autoriser la redirection Stripe
      maxAge: 1000 * 60 * 60,  // 1h
    }
  })
);

// ✅ parser AVANT le csrfProtection
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.use((req, res, next) => {
  res.locals.message = req.session.message || null;
  delete req.session.message; 
  next();
});

// CSRF protection maintenant que session + body sont en place
app.use(csrfProtection);

// Injecte automatiquement le token dans toutes les vues
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Autres middlewares
app.use(logger);
app.use(setUserLocals);
app.use(cors());
app.use(sanitizeInputs);

// Vues
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../frontend/views"));
app.use(express.static(path.join(__dirname, '../public')));


// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/themes", themeRoutes);
app.use("/cursus", cursusRoutes);
app.use("/lessons", lessonRoutes);
app.use("/purchases", purchaseRoutes);
app.use("/progress", progressRoutes);
app.use("/certifications", certificationRoutes);
app.use('/admin', adminRoutes);

// Accueil
app.get("/", async (req, res) => {
  const message = req.session.message;
  req.session.message = null;

  const featuredCursus = await Cursus.find({ featured: true }).limit(3);

  res.render("index", { message, featuredCursus });
});

module.exports = app;
