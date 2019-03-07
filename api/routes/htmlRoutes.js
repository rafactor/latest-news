const express = require("express");
const router = express.Router();

router.get("/", function(req, res) {
    console.log("root");
    res.render("index", {});
  });

  router.get("/latest-news", function(req, res) {
    console.log("root");
    res.render("latest-news", { message: "testddd"});
  });

module.exports = router;