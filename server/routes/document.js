const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(); // in-memory
const { analyzeDocumentFromPDF } = require('../controllers/generalController');

router.post('/', upload.single('file'), analyzeDocumentFromPDF);
module.exports = router;
