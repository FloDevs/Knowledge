module.exports = (req, res, next) => {
  res.locals.message = req.session.message || null;
  delete req.session.message;
  next();
};
