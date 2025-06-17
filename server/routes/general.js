const express = require('express');
const router = express.Router();
const { analyzeGeneralBias } = require('../controllers/generalController');

router.post('/', analyzeGeneralBias);

module.exports = router; 