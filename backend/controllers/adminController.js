const { getAllCursusRaw } = require("./cursusController");
const { getAllLessons } = require("./lessonController");
const { getAllUsers } = require("./userController");
const { getAllPurchases } = require("./purchaseController");
const { getAllThemes } = require("./themeController");

exports.renderDashboard = (req, res) => {
  res.render("admin/dashboard", {
    pageStylesheet: "admin/admin-dashboard",
  });
};

exports.renderCursusPage = async (req, res) => {
  try {
    const cursusList = await getAllCursusRaw();
    const lessons = await getAllLessons();
    const themes = await getAllThemes();

    const cursusWithLessons = cursusList.map((cursus) => ({
      ...cursus,
      lessons: lessons.filter(
        (lesson) => lesson.cursus?.toString() === cursus._id.toString()
      ),
    }));

    res.render("admin/cursus", {
      cursusWithLessons,
      themes,
      pageTitle: "Gérer les Cursus",
      pageStylesheet: "admin/admin-cursus",
    });
  } catch (error) {
    console.error("Erreur dans renderCursusPage:", error);
    res.status(500).send("Erreur lors du chargement des cursus");
  }
};

exports.renderUsersPage = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.render("admin/users", {
      users,
      pageTitle: "Gérer les Utilisateurs",
      pageStylesheet: "admin/admin-users",
    });
  } catch (error) {
    console.error("Erreur dans renderUsersPage:", error);
    res.status(500).send("Erreur lors du chargement des utilisateurs");
  }
};

exports.renderOrdersPage = async (req, res) => {
  try {
    const orders = await getAllPurchases();
    res.render("admin/orders", {
      orders,
      pageTitle: "Gérer les Commandes",
      pageStylesheet: "admin/admin-orders",
    });
  } catch (error) {
    console.error("Erreur dans renderOrdersPage:", error);
    res.status(500).send("Erreur lors du chargement des commandes");
  }
};
