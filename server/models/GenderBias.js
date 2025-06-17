const mongoose = require('mongoose');

const genderBiasSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    index: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'neutral'],
    required: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    required: true
  },
  biasType: {
    type: String,
    enum: ['stereotypical', 'anti-stereotypical', 'neutral'],
    required: true
  },
  domain: {
    type: String,
    required: true
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create text index for search
genderBiasSchema.index({ text: 'text' });

module.exports = mongoose.model('GenderBias', genderBiasSchema); 