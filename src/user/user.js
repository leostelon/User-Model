const express = require("express");
const router = new express.Router();
const mysql = require("../functions/sql");
const { nanoid } = require("nanoid");

const hash = require("../middlewares/hash");
const login = require("../middlewares/login");
const auth = require("../middlewares/auth");
const setToken = require("../functions/token");
const CheckError = require("../functions/sqlerror");

//Class derived from sqlerror.js from functions
const checkError = new CheckError();
//Function derived from response.js from functions
const response = require("../functions/response");

// Create User
router.post("/createuser", hash, (req, res) => {
  let user = [];
  const id = nanoid(9);
  // for (let key in req.body) {
  //   user.push(req.body[key]);
  // }
  user[0] = req.body.email;
  user[1] = req.body.username;
  user[2] = req.body.password;

  const sql = "insert into user (id,email,username,password) values ?";

  mysql.query(sql, [[[id, ...user]]], async (error, result) => {
    if (error) {
      return checkError.check(error, res);
    }
    var token = await setToken(id);
    token
      ? response(res, 201, "User has been created.", token.message)
      : response(res, 300, "Token generation failed!");
  });
});

//Login User
router.post("/login", login, async (req, res) => {
  try {
    var token = await setToken(req.user.id);
    return response(res, 200, "User logged in.", token.message);
  } catch (error) {
    response(res, 500, "Bad Request.");
  }
});

//Read User
router.get("/getuser", auth, async (req, res) => {
  response(res, 200, req.user);
});

//Update User
router.post("/updateuser", auth, hash, (req, res) => {
  let user = req.body;
  var requiredUpdates = ["username", "password", "email"];
  var updates = [];
  for (key in user) {
    if (!requiredUpdates.includes(key))
      return response(res, 400, "Bad request.");
    updates.push(key);
  }
  var seperator = ",";
  let params = ``;
  for (let i = 0; i < updates.length; i++) {
    if (i === updates.length - 1) seperator = "";
    params = params.concat(
      updates[i] + "=" + "'" + user[updates[i]] + "'" + seperator
    );
  }
  var sql = `update user set ${params} WHERE id='${req.user.userid}'`;
  mysql.query(sql, (error, result) => {
    if (error) {
      checkError.check(error, res);
    } else {
      response(res, 200, "User has been updated");
    }
  });
});

router.post("/reset", (req, res) => {
  try {
    if (!req.body.username) throw new Error();
    const user = req.body.username;
    const sql = `select email from user where username='${user}' || email='${user}'`;
    mysql.query(sql, (error, result) => {
      if (error) {
        checkError.check(error, res);
      } else {
        if (result.length <= 0)
          return response(res, 200, "No user found by the username");
        res.send();
      }
    });
  } catch (error) {
    response(res, 400, "Bad request.");
  }
});

router.get("/test", (req, res) => {
  res.send({
    message: "working",
    code: 200,
  });
});

module.exports = router;
