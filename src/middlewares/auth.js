const jwt = require("jsonwebtoken");

const mysql = require("../mySQL/sql");
const response = require("../response");

var auth = async (req, res, next) => {
  try {
    //Check for Authorization in Header
    if (!req.get("authorization")) throw new Error();

    let token = req.get("Authorization").split(" ")[1];
    //Check if token verifies with the secret
    var decoded = jwt.verify(token, process.env.JWT_SECRET);

    const sql = `select userid from token where token='${token}'`;
    mysql.query(sql, (error, result) => {
      if (error) response(res, 500, error);
      if (result.length > 0) {
        //pass the userid for further request
        req.user = result[0];
        next();
      }
    });
  } catch (error) {
    response(res, 403, "Unauthorized access");
  }
};
module.exports = auth;
