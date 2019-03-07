const mongoose = require("mongoose");
const Articles = require("../models/article");
const axios = require("axios");
const cheerio = require("cheerio");
const moment = require('moment')

// function filterIt(arr, searchKey) {
//   return arr.filter(function(obj) {
//     return Object.keys(obj).some(function(key) {
//       return obj[key] === searchKey;
//     });
//   });
// }

function getSearchUrl(req) {
  const source = req.body.source;
  const type = req.body.type;
  const department = req.body.department;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const index = req.body.index;

  switch (source) {
    case "canada":
      //Build the news URL
      let domain =
        "https://www.canada.ca/en/news/advanced-news-search/news-results.html?";
      let key = "_=1551119106311";

      let params = {
        type: (type === "" || type === undefined) ? "&typ=" : "&typ=" + type,
        page: (index >= 0) ? "&idx=" + index * 10 : "&idx=0" ,
        department: (type === "" || type === undefined) ? "&dprtmnt=" : "&dprtmnt=" + department,
        start: (type === "" || type === undefined) ? "&start=" : "&start=" + startDate, 
        end: (type === "" || type === undefined) ? "&end=" : "&end=" + endDate, 
      };

      var scrappingUrl = domain + key;

      for (key in params) {
            scrappingUrl += params[key];
      }
  }



  return {
    url: scrappingUrl,
    source: "Government of Canada"
  };
}

exports.articles_scrape = (req, res, next) => {
  console.log('start')
  var scraped = getSearchUrl(req);
  var counter = 0;
  var alreadyInDB;
  var scrappedPage = {
    count: 0,
    from: 0,
    to: 0,
    total: 0,
    page: 0,
    pages: 0,
    request: {},
    articles: []
  }
  // var scrapedOn = moment().format()

  console.log(scraped)
  Articles.find()
    .select()
    //add source filter
    .exec()
    .then(docs => {
      // Get saved URLs from DB
      const urlFromDB = docs.map(doc => doc.url);

      //  Scrape the website
      axios.get(scraped.url).then(function(response) {
        //   Load the html body from axios into cheerio
        var $ = cheerio.load(response.data);

        // var $options = $('#dprtmnt').innerHTML
        // console.log(response.data )

        const totals = $('.mwsharvest > h3').text().split(" ");
        scrappedPage.from = totals[1]
        scrappedPage.to  = totals[3]
        scrappedPage.total  = totals[5]
        scrappedPage.page = Math.ceil(totals[1] / 10)
        scrappedPage.pages = Math.ceil(totals[5] / 10)
        scrappedPage.request = req.body
        scrappedPage.source = scraped.source

  
        //   For each article class
        $("article").each(function(i, element) {
          var title = $(element)
            .children("h3")
            .text();
          var url = $(element)
            .children("h3")
            .children("a")
            .attr("href");
          var date = $(element)
            .children("p")
            .first()
            .children("time")
            .attr("datetime");
          var line = $(element)
            .children("p")
            .first()
            .text()
          var summary = $(element)
            .children("p")
            .last()
            .text();

          var splittedline = line.split("|", 3)
          var department = splittedline[1].trim()
          var type = splittedline[2].trim()

          
          // Proceed if the article has an url
          if (url) {
            const newsUrl = urlFromDB.filter(searchNews => searchNews === url);
            alreadyInDB = newsUrl.length > 0 ? true : false;

              scrappedPage.articles.push({
                source: scraped.source,
                title: title,
                type: type,
                department: department,
                url: url,
                summary: summary,
                publishedDate: date,
                status: newsUrl.length > 0 ? null : "new",
              });
              
            // // Check if the urls already exists in the database
          
            //   const news = new Articles({
            //     _id: new mongoose.Types.ObjectId(),
            //     source: scraped.source,
            //     title: title,
            //     type: type,
            //     department: department,
            //     url: url,
            //     summary: summary,
            //     publishedDate: date,
            //   });
              
            //   scrappedPage.articles.push(news)
            //   news
            //     .save()
            //     .then(counter++)
            //     .catch(err => {
            //       console.log(err);
            //       res.status(500).json({
            //         error: err
            //       });
            //     });
            
          }
        });

        console.log(scrappedPage)

        // if (counter === 0) {
        //   message = "You're up to date. There is no news to review.";
        // } else if ((counter === 1)) {
        //   message = "1 new article found";
        // } else {
        //   message = counter + " new articles found";
        // }

        // console.log(" go ")
        // res.redirect("/latest-news")

        let data = scrappedPage
        res.render("latest-news", {data, layout: false})


        // res.status(200).json({
        //   scrappedPage
        // });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.articles_get_all = (req, res, next) => {
  Articles.find()
    .select("source title type date department status category url summary updatedOn")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        articles: docs.map(doc => {
          return {
            _id: doc._id,
            title: doc.title,
            source: doc.source,
            department: doc.department,
            type: doc.type,
            url: doc.url,
            summary: doc.summary,
            date: doc.date,
            status: doc.status,
            updatedOn: doc.updatedOn,
            request: {
              type: "GET",
              url: "http://localhost:3000/articles/" + doc._id
            }
          };
        })
      };

      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.save_news = (req,res, next) => {
  SavedArticles.find()
}

exports.reset = (req, res, next) => {
  Articles.remove()
}