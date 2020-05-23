const express = require("express");
const router = new express.Router();
const mysql = require("../mySQL/sql");
const { nanoid } = require("nanoid");

const response = require("../response");
const hash = require("../middlewares/hash");
const login = require("../middlewares/login");
const auth = require("../middlewares/auth");
const setToken = require("../token/token");
const CheckError = require("../functions/sqlerror");

//Class derived from sqlerror.js from functions
const checkError = new CheckError();

// Create User
router.post("/createuser", hash, (req, res) => {
  let user = [];
  const id = nanoid(9);
  for (let key in req.body) {
    user.push(req.body[key]);
  }
  const sql = "insert into user (id,email,username,password) values ?";

  mysql.query(sql, [[[id, ...user]]], async (error, result) => {
    if (error) {
      return checkError.check(error);
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

router.get("/test", (req, res) => {});

module.exports = router;
