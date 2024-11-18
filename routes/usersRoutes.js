const express = require('express');

const router = express.Router();
const controller = require('../controller/userController');

router.get('/users', controller.getAllUser);
router.get('/users/:userId', controller.getUserById);
router.get('/users/username/:username', controller.getUserByUsername);
router.post('/users/auth', controller.authenticate);
router.post('/users', controller.createUser);
router.put('/users/:userId', controller.editUserData);
router.delete('/users/:userId', controller.deleteUserById);

module.exports = router;
