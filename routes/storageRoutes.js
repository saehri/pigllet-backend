const express = require('express');

const router = express.Router();
const controller = require('../controller/storageController');

router.get('/data/:userId', controller.getUserData);
router.get('/data/get', controller.getData);
router.put('/data/:userId', controller.updateStorage);
router.post('/data/store', controller.storeData);
router.delete('/data/:userId', controller.deleteStorage);

module.exports = router;
