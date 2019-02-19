var express = require("express");
var router = express.Router();

// Requiring our custom middleware for checking if a user is logged in

router.get("/", function(req, res) {
    console.log('root')
  res.render("index", {});
});

module.exports = router;
