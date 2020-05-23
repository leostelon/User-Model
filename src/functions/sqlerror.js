const mysql = require("mysql");

class checkError {
  constructor() {}

  //Provide SQL error Object and express res Object
  check(error, res) {
    if (error.errno === 1062) {
      if (error.sqlMessage.includes("user.username")) {
        return response(res, 100, error.sqlMessage);
      }
      if (error.sqlMessage.includes("user.email")) {
        return response(res, 101, error.sqlMessage);
      }
    }
    if (error.errno === 1136) return response(res, 500, "Bad Request.");
    return response(res, 500, error);
  }
}

module.exports = checkError;
