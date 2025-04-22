module.exports = (req, res, next) => {
    res.locals.message = req.session.message || null;
    req.session.message = null;
    next();
  };
  