const mongoose = require('mongoose');

const mediaBiasSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    index: true
  },
  source: {
    type: String,
    required: true
  },
  bias: {
    type: String,
    enum: ['left', 'center', 'right'],
    required: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1,
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
mediaBiasSchema.index({ text: 'text' });

module.exports = mongoose.model('MediaBias', mediaBiasSchema); 