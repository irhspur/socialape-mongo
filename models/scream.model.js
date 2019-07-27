const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const screamSchema = new Schema({
  userHandle: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  likeCount: {
    type: Number,
  },
  commentCount: { type: Number },
});

const Scream = mongoose.model('Scream', screamSchema);

module.exports = Scream;
