
const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    headline: String,
    summary: String,
    url: String
});

module.exports = mongoose.model('Article', articleSchema)
