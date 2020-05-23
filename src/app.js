const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const User = require("./user/user");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use(User);

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log("Server is up and running on port " + PORT);
});
