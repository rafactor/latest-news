const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Article = require("../models/articles");

// Handle incoming GET requests to /articles
router.get('/', (req, res, next) => {
    //where / limit
    Article.find()
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                articles: docs.map(doc => {
                  return {
                    headline: doc.headline,
                    summary: doc.summary,
                    url: doc.url,
                    source: doc.source,
                    category: doc.category,
                    _id: doc._id,
                    request: {
                      type: "GET",
                      url: "http://localhost:3000/articles/" + doc._id
                    }
                };
              })
            };
            // if (docs.length > 0) {
            res.status(200).json(response);
            // }
            // else {
            //     res.status(404).json({
            //         message: "No entries found"
            //     })
            // }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

router.post('/', (req, res, next) => {
    const article = new Article({
        _id: new mongoose.Types.ObjectId(),
        headline: req.body.headline,
        summary: req.body.summary,
        url: req.body.url
    });
    article
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Article Saved',
                savedArticle: article
            });
        }).catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        });
});

router.get('/:articleId', (req, res, next) => {
    const id = req.params.articleId;
    Article.findById(id)
        .exec()
        .then(doc => {
            console.log('from database', doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({
                    message: "No valid entry found for provided ID"
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.patch("/:articleId", (req, res, next) => {
    const id = req.params.articleId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }

    console.log(updateOps)
    Article.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
        console.log(result)
        res.status(200).json(result)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:articleId', (req, res, next) => {
    const id = req.params.articleId;
    Article.remove({
            _id: id
        })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/all', (req, res, next) => {
    // const id = req.params.articleId;
    Article.remove()
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;