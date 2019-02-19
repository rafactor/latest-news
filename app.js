const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const hbs = require("express-handlebars");

const htmlRoutes = require("./api/routes/htmlRoutes")
const articleRoutes = require("./api/routes/articles");
const scrapeRoutes = require("./api/routes/scrapes");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true
});

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//prevent CORS errors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

//Handlebars
app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: "main"
    // layoutsDir: __dirname + "/views/layouts/"
  })
);
app.set("view engine", "hbs");

// Routes which should handle requests
app.use("/", htmlRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/scrape", scrapeRoutes);

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
