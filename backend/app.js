const express = require("express");
const path = require("path");
const cors = require("cors");
const session = require("express-session");
const helmet = require("helmet");
const methodOverride = require("method-override");
const flashMessage = require("./middlewares/flashMessage");

require("dotenv").config();

const Cursus = require("./models/Cursus");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const themeRoutes = require("./routes/themeRoutes");
const cursusRoutes = require("./routes/cursusRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const progressRoutes = require("./routes/progressRoutes");
const certificationRoutes = require("./routes/certificationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cartRoutes = require("./routes/cartRoutes");

const {
  logger,
  setUserLocals,
  sanitizeInputs,
  csrfProtection,
} = require("./middlewares");

const app = express();

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "https://www.youtube.com",
          "https://www.youtube-nocookie.com",
          "https://s.ytimg.com",
        ],
        frameSrc: [
          "'self'",
          "https://www.youtube.com",
          "https://www.youtube-nocookie.com",
          "https://drive.google.com",
        ],
        mediaSrc: [
          "'self'",
          "https://www.youtube.com",
          "https://www.youtube-nocookie.com",
        ],
        imgSrc: [
          "'self'",
          "data:",
          "https://i.ytimg.com",
          "https://lh3.googleusercontent.com",
        ],
        formAction: ["'self'", "https://checkout.stripe.com"],
      },
    },
  })
);

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1); // required for the secure cookie to work properly behind a proxy
}

app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallbackSecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
    },
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(csrfProtection);

// Token CSRF for all views
app.use((req, res, next) => {
  if (typeof req.csrfToken === "function") {
    res.locals.csrfToken = req.csrfToken();
  }
  next();
});

app.use(flashMessage);
app.use(logger);
app.use(setUserLocals);
app.use(cors());
app.use(sanitizeInputs);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../frontend/views"));
app.use(express.static(path.join(__dirname, "../public")));

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/themes", themeRoutes);
app.use("/cursus", cursusRoutes);
app.use("/lessons", lessonRoutes);
app.use("/purchases", purchaseRoutes);
app.use("/progress", progressRoutes);
app.use("/certifications", certificationRoutes);
app.use("/admin", adminRoutes);
app.use("/cart", cartRoutes);

app.get("/", async (req, res) => {
  const message = req.session.message;
  req.session.message = null;

  const featuredCursus = await Cursus.find({ featured: true }).limit(3);

  res.render("index", { message, featuredCursus, pageStylesheet: "index" });
});

app.use((req, res) => {
  res.status(404).render("404", {
    pageStylesheet: "404",
  });
});

module.exports = app;
