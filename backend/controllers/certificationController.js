const PDFDocument = require('pdfkit');
const Certification = require('../models/Certification');
const User = require('../models/User');
const Cursus = require('../models/Cursus')

// GET ALL CERTIFICATIONS (Admin)
exports.getAllCertifications = async (req, res) => {
  try {
    const certifs = await Certification.find({})
      .populate("user")
      .populate("cursus");
    res.json(certifs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET USER CERTIFICATIONS
exports.getUserCertifications = async (req, res) => {
  try {
    const { userId } = req; // from auth
    const userCertifs = await Certification.find({ user: userId })
      .populate("cursus");
    res.json(userCertifs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.downloadCertificate = async (req, res) => {
  try {
    const { userId } = req; 
    const { cursusId } = req.params;

    const certif = await Certification.findOne({ user: userId, cursus: cursusId }).populate('cursus');
    if (!certif) {
      return res.status(403).send('Aucune certification trouvée.');
    }

    const user = await User.findById(userId);

    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=certificat-${user.name}.pdf`);
    doc.pipe(res);

    doc
      .fontSize(20)
      .text('🎓 Certificat de Réussite', { align: 'center' })
      .moveDown(2);

    doc
      .fontSize(14)
      .text(`Ce document certifie que`, { align: 'center' })
      .moveDown();

    doc
      .fontSize(18)
      .text(`${user.name}`, { align: 'center', underline: true })
      .moveDown();

    doc
      .fontSize(14)
      .text(`a complété avec succès le cursus suivant :`, { align: 'center' })
      .moveDown();

    doc
      .fontSize(16)
      .text(`${certif.cursus.title}`, { align: 'center', underline: true })
      .moveDown(2);

    doc
      .fontSize(12)
      .text(`Délivré le : ${new Date(certif.issuedAt).toLocaleDateString('fr-FR')}`, { align: 'center' });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la génération du certificat.");
  }
};

exports.getUserCertificationsView = async (req, res) => {
  try {
    const userId = req.session.user._id;

    const certifications = await Certification.find({ user: userId })
      .populate("cursus");

    res.render("main/mes-certificats", { certifications });
  } catch (err) {
    res.status(500).render("error", {
      message: "Erreur lors du chargement des certificats",
      error: err
    });
  }
};
