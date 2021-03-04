const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");
const getSecret = require("./endpoints/getSecret");
const postSecret = require("./endpoints/createNewSecret");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const db = require("./config/keys").mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("[Mongo DB]: MONGO CONNECTED"))
  .catch(err => console.error(err));

app.get("/", (req, res) => {
  res.send("healthcheck okay");
});

app.get("/secret/:hash", getSecret);

app.post("/secret", postSecret);

module.exports = {
  path: "/api/",
  handler: app
};
