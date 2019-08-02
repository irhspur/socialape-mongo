const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  userHandle: {
    type: String,
    required: true,
  },
  screamId: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
