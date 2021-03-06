const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    source: { type: String, required: true },
    title: { type: String, required: true },
    type:  { type: String, required: false },
    department: { type: String, required: false },
    url: { type: String, required: true },
    summary: { type: String, required: true },
    publishedDate: { type: Date, required: true },
    createdAt: { type: Date, required: true, default: Date.now }
    // timestamps: true
    // status: { type: String, required: true, default: "new" },
});

module.exports = mongoose.model('Article', articleSchema);