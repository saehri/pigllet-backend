const express = require('express')

const router = express.Router()
const controller = require('../controller/passwordResetTicketController')

router.post('/prt/verify', controller.verifyCode)


module.exports = router