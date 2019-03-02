const mongoose = require('mongoose');

const viewedArticleSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: true
    }, 
    saved: {
        type: Boolean,
        default: false
    },
    removed: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('ViewedArticle', viewedArticleSchema);