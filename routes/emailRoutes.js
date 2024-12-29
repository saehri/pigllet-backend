const express = require('express');

const router = express.Router();
const controller = require('../controller/emailController');

router.get('/email/vlinks', controller.getAllvLinks);
router.get('/email/gvl/:user_id/:email', controller.sendUserVerificationEmail);
router.get('/email/reset-password/:user_id/:email', controller.sendPasswordResetTokenEmail);
router.get('/email/verif/:token', controller.verifyUserEmail);

module.exports = router;
