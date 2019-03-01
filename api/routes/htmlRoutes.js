const express = require("express");
const router = express.Router();

router.get("/", function(req, res) {
    console.log("root");
    res.render("index", {});
  });

module.exports = router;