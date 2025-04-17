module.exports = (req, res, next) => {
    if (req.session && req.session.user) {
      return next();
    }
    return res.redirect("/login?message=Veuillez%20vous%20connecter");
  };
  