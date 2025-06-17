const express = require('express');
const router = express.Router();
const { analyzeMediaBias } = require('../controllers/mediaController');

// POST /analyze-media
router.post('/', analyzeMediaBias);

module.exports = router; 