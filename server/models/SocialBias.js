const mongoose = require('mongoose');

const socialBiasSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    index: true
  },
  targetCategory: {
    type: String,
    required: false
  },
  targetMinority: {
    type: String,
    required: false
  },
  targetStereotype: {
    type: String,
    required: false
  },
  offensiveYN: {
    type: Number,
    min: 0,
    max: 1,
    required: true
  },
  intentYN: {
    type: Number,
    min: 0,
    max: 1,
    required: true
  },
  sexYN: {
    type: Number,
    min: 0,
    max: 1,
    required: true
  },
  metadata: {
    annotatorGender: String,
    annotatorAge: Number,
    annotatorRace: String,
    annotatorPolitics: String,
    dataSource: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create text index for search
socialBiasSchema.index({ text: 'text' });

module.exports = mongoose.model('SocialBias', socialBiasSchema); 