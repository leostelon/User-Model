const bcrypt = require("bcrypt");
const response = require("../response");

var hash = async (req, res, next) => {
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return response(res, 400, "Password must be atleast 6 char. long.");
    }
    bcrypt.hash(req.body.password, 10, function (err, hash) {
      req.body.password = hash;
      next();
    });
  } else {
    next();
  }
};

module.exports = hash;
