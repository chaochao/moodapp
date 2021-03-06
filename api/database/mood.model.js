var mongoose = require('mongoose');
var moodSchema = mongoose.Schema({
  created_at: {
    type: Date,
    default: Date.now
  },
  level: {
    type: Number,
    max: 10,
    min: 0,
    required: true
  },
  description: {
    type: String,
    max: 500
  },
  owner: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    username: String,

  },
  location: {
    address: String,
    country: String,
    state: String,
    province: String,
    city: String,
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  }
})
mongoose.model('Mood', moodSchema);