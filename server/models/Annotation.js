const mongoose = require('mongoose');

const annotationSchema = new mongoose.Schema({
  sentence_id: { type: String, required: true, unique: true },
  text: { type: String, required: true },
  label: { type: String, required: true },
  outlet: { type: String, required: true },
  type: { type: String, required: true }, // 'left', 'right', 'Non-biased'
});

module.exports = mongoose.model('Annotation', annotationSchema); 