const express = require('express');

const router = express.Router();
const controller = require('../controller/emailController');

router.get('/email/vlinks', controller.getAllvLinks);
router.get('/email/gvl/:userId/:email', controller.sendUserVerificationEmail);
router.get('/email/verif/:verifId', controller.verifyUserEmail);

module.exports = router;
