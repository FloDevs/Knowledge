const csrf = require('csurf');

const baseCsrf = csrf(); 

module.exports = (req, res, next) => {
  if (req.is('multipart/form-data')) {
    return next();            
  }
  return baseCsrf(req, res, next);
};

module.exports.raw = baseCsrf;
