var express = require("express");
var router = express.Router();

////const GenreModel = require("../models/Genre");
///* GET home page. */
//router.get("/", function (req, res, next) {
//  //const newGenre = new GenreModel({ name: "lust" });
//  //console.log("yes");
//  //newGenre.save().then((res) => {
//  //  console.log(newGenre);
//  //});
//  res.render("index", { title: "Express" });
//});

// GET home page.
router.get("/", function (req, res) {
  res.redirect("/catalog");
});

module.exports = router;
