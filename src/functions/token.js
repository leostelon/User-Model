const jwt = require("jsonwebtoken");
const mysql = require("./sql");

const setToken = (userid) => {
  return new Promise((resolve, reject) => {
    var token = jwt.sign({ userid }, process.env.JWT_SECRET);
    var sql = `insert into token (userid,token) values ('${userid}','${token}')`;
    mysql.query(sql, (error, result) => {
      if (error) {
        reject({ code: 300, message: error.sqlMessage });
      }
      resolve({ code: 202, message: token });
    });
  });
};

// setToken("eL8ausHfe")
//   .then((result) => [console.log(result)])
//   .catch((error) => {
//     console.log(error);
//   });

module.exports = setToken;
