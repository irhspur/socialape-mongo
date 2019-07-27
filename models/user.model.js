const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  handle: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  bio: {
    type: String,
  },
  website: {
    type: String,
  },
  location: { type: String },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
