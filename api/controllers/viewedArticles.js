const mongoose = require("mongoose");

const Articles = require("../models/article");
const ViewedArticles = require("../models/viewedArticle");

exports.view_article = (req, res, next) => {

  const articleId = req.params.articleId;

  Articles.findById(articleId)
    .then(article => {
      if (!article) {
        return res.status(404).json({
          message: "Article not found"
        });
      }
      const viewedArticles = new ViewedArticles({
        _id: mongoose.Types.ObjectId(),
        article: articleId
      });

      return viewedArticles.save();
    })
    .then(result => {
      res.status(201).json({
        message: "Article saved",
        viewedArticle: {
          _id: result._id,
          article: result.article
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/viewed/" + result._id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.viewed_articles_get_all = (req, res, next) => {

  ViewedArticles.find()
    .select("article ViewedArticles _id removed saved")
    .populate("article", "title source type summary department url date updatedOn status")
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        array: docs.map(doc => {
          return {
            _id: doc._id,
            removed: doc.removed,
            saved: doc.saved,
            article: doc.article,
            updatedOn: doc.updatedOn,
            request: {
              type: "GET",
              url: "http://localhost:3000/test/" + doc._id
            }
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.view_article_detail = (req, res, next) => {
  const _id = req.params.articleId;

  ViewedArticles.findById(_id)
    .populate("article", "source title type department url summary date")
    .exec()
    .then(result => {
      if (!result) {
        return res.status(404).json({
          message: "article not found"
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.update_article_flag = (req, res, next) => {
  const id = req.params.articleId;
  const updateOps = {};

  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  ViewedArticles.update({ _id: id, user: user }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Article updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/article/" + id
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
