const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require('dotenv').config()

const articleRoutes = require("./api/routes/articles");
const htmlRoutes = require("./api/routes/htmlRoutes")

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));




var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/express";
mongoose.connect(MONGODB_URI);

mongoose.Promise = global.Promise;


app.use(morgan("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());


app.use("/articles", articleRoutes);
app.use("/", htmlRoutes);


// Set Handlebars.
var hbs = require("express-handlebars");

app.engine("handlebars", hbs({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});


module.exports = app;