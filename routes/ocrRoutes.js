const express = require('express');
const multer = require('multer');

const router = express.Router();
const controller = require('../controller/ocrController');

// Set up multer middleware to handle file uploads (memory storage)
const upload = multer({storage: multer.memoryStorage()});

router.get('/ocr/scan/:executionId', controller.getScannedResult);
router.post('/ocr/scan', upload.single('file'), controller.scanReceipt);

module.exports = router;
