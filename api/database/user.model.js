var mongoose = require('mongoose');

var userShema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  password: {
    type: String,
    required: true
  },
  description: String,
  moods: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mood'
  }],
  tags: [String],
  follows: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true
  }],
  gender: {
    type: String,
    default: "male"
  },
  age: Number,
  location: {
    address: String,
    country: String,
    province: String,
    state: String,
    city: String,
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  },
  avatar_url: String,
  created_at: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('User', userShema);