var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var slug = require('slug');
var User = mongoose.model('user');
module.exports = mongoose.model('post', {
    slug: {type: String, lowercase: true, unique: true},
    postId: String,
    title: String,
    description: String,
    favoritesCount: {type: Number, default: 0},
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    tagList: [{ type: String }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    images : String,
    createdAt: String,
    editedAt: String,
    views : {},
    blocks : {} ,

});