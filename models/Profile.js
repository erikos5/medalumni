const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  graduationYear: {
    type: Number,
    required: true
  },
  degree: {
    type: String,
    required: true
  },
  bio: {
    type: String
  },
  location: {
    type: String
  },
  currentPosition: {
    type: String
  },
  company: {
    type: String
  },
  website: {
    type: String
  },
  skills: {
    type: [String]
  },
  social: {
    linkedin: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    instagram: {
      type: String
    }
  },
  profileImage: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved'],
    default: 'pending'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Profile', ProfileSchema); 