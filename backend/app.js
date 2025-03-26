const express = require('express');
const path = require("path");
const cors = require('cors');

const userRoutes = require("./routes/userRoutes");
const themeRoutes = require("./routes/themeRoutes");
const cursusRoutes = require("./routes/cursusRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const progressRoutes = require("./routes/progressRoutes");
const certificationRoutes = require("./routes/certificationRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../public")));

app.use("/api/users", userRoutes);
app.use("/api/themes", themeRoutes);
app.use("/api/cursus", cursusRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/certifications", certificationRoutes);


// Routes de pages HTML
app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/register.html"));
  });
  
  app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });
  
  app.get("/cursus", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/cursus.html"));
  });
  
  app.get("/themes", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/themes.html"));
  });
  
  app.get("/lessons", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/lessons.html"));
  });
  

app.get('/', (req, res) => res.send('Knowledge Learning API Running!'));

module.exports = app;