const express = require('express');

const router = express.Router();
const controller = require('../controller/storedDataController');

router.post('/data/store', controller.storeData);

module.exports = router;
