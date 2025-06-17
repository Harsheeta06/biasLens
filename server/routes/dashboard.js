const express = require('express');
const router = express.Router();
const { getPoliticalLeaningDistribution, getOffensivePhrases, getGenderBiasWordFrequency, getBiasDistribution } = require('../controllers/dashboardController');

router.get('/political-leaning', getPoliticalLeaningDistribution);
router.get('/offensive-phrases', getOffensivePhrases);
router.get('/gender-bias-word-frequency', getGenderBiasWordFrequency);
router.get('/bias-distribution', getBiasDistribution);

module.exports = router; 