const express = require("express");
const mysql = require("../functions/sql");
const auth = require("../middlewares/auth");

const router = new express.Router();

router.post("/createtournament", auth, (req, res) => {
  let details = req.body;
  mysql;
});
