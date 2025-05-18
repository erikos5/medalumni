const mongoose = require('mongoose');

const SchoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  departments: [
    {
      name: {
        type: String,
        required: true
      },
      description: {
        type: String
      }
    }
  ],
  programs: {
    undergraduate: [String],
    postgraduate: [String],
    professional: [String]
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('School', SchoolSchema); 