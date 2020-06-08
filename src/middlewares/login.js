const bcrypt = require("bcrypt");
const mysql = require("../functions/sql");

var login = async (req, res, next) => {
  try {
    if (!req.body.username || !req.body.password) throw new Error();
    let user = req.body;
    const sql = `select id,username,password from user where username='${user.username}' limit 1`;
    mysql.query(sql, async (error, result) => {
      if (error) return response(res, 500, error);
      if (result.length <= 0)
        response(res, 200, "No user found by that username.");
      await bcrypt.compare(req.body.password, result[0].password, function (
        err,
        isMatch
      ) {
        if (isMatch) {
          req.user = result[0];
          next();
        } else {
          return response(res, 200, "Wrong password!");
        }
      });
    });
  } catch (error) {
    return response(res, 500, "Bad Request.");
  }
};

module.exports = login;
