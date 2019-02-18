const express = require("express");
const router = express.Router();
const Article = require("../models/articles");
const mongoose = require("mongoose");

// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

function filterIt(arr, searchKey) {
  return arr.filter(function(obj) {
    return Object.keys(obj).some(function(key) {
      return obj[key] === searchKey;
    });
  });
}

router.get("/ircc", (req, res, next) => {
  console.log("start");
  const url =
    "https://www.canada.ca/en/news/advanced-news-search/news-results.html?_=1550444489000&typ=newsreleases&dprtmnt=departmentofcitizenshipandimmigration&start=&end=";

  var response = [];
  var skipped = 0;
  var added = 0; 

  Article.find()
    .select("_id url")
    .exec()
    .then(docs => {
      const urlsDB = docs.map(doc => {
        return {
          // _id: doc._id,
          url: doc.url
        };
      });

      axios.get(url).then(docs => {
        // Load the html body from axios into cheerio
        var $ = cheerio.load(docs.data);  

        $("article").each(function(i, element) {
          // Save the text and href of each link enclosed in the current element
          var headline = $(element)
            .children("h3")
            .children("a")
            .text();
          var url = $(element)
            .children("h3")
            .children("a")
            .attr("href");
          var date = $(element)
            .children("p")
            .children("time")
            .attr("datetime");
          var byline = $(element)
            .children("p:first-of-type")
            .text()
            .trim();
          var summary = $(element)
            .children("p:last-of-type")
            .text();
          var source = "www.canada.ca";
          var category = "IRCC";

          if (url) {
            let find = filterIt(urlsDB, url);

            if (find.length === 0) {
              const article = new Article({
                _id: new mongoose.Types.ObjectId(),
                source: source,
                category: category,
                headline: headline,
                summary: summary,
                url: url
              });
              article.save()
              .then(added++);
              
            } else {
              skipped++
            }
          }
        });
        var response = {"skipped": skipped, "added": added}
        console.log(response)
        return response
      });
    }),
    res.status(200).json({
      message: "scraped",
      skipped: skipped,
      added: added
    //   articles: docs
    });
});

module.exports = router;
