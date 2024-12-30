const express = require('express')

const router = express.Router()
const controller = require('../controller/subscriptionsBackupController')

router.get('/backup/subscriptions', controller.getAllBackup)
router.get('/backup/subscriptions/:backup_id', controller.getBackup)
router.post('/backup/subscriptions', controller.createBackup)
router.delete('/backup/subscriptions/:backup_id', controller.deleteBackup)
router.put('/backup/subscriptions/:backup_id', controller.updateBackup)

module.exports = router