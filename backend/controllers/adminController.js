const { getAllCursusRaw  } = require('./cursusController');
const { getAllLessons } = require('./lessonController');
const { getAllUsers } = require('./userController');
const { getAllPurchases } = require('./purchaseController');

// Dashboard principal
exports.renderDashboard = (req, res) => {
  res.render('admin/dashboard');
};

// Page Cursus + Leçons
exports.renderCursusPage = async (req, res) => {
  try {
    const cursusList = await getAllCursusRaw();
    const lessons = await getAllLessons();

    const cursusWithLessons = cursusList.map(cursus => ({
      ...cursus,
      lessons: lessons.filter(
        lesson => lesson.cursus?.toString() === cursus._id.toString()
      )
    }));

    res.render('admin/cursus', { cursusWithLessons });
  } catch (error) {
    console.error("Erreur dans renderCursusPage:", error);
    res.status(500).send("Erreur lors du chargement des cursus");
  }
};

// Page Utilisateurs
exports.renderUsersPage = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.render('admin/users', { users });
  } catch (error) {
    console.error("Erreur dans renderUsersPage:", error);
    res.status(500).send("Erreur lors du chargement des utilisateurs");
  }
};

// Page Commandes
exports.renderOrdersPage = async (req, res) => {
  try {
    const orders = await getAllPurchases();
    res.render('admin/orders', { orders });
  } catch (error) {
    console.error("Erreur dans renderOrdersPage:", error);
    res.status(500).send("Erreur lors du chargement des commandes");
  }
};
