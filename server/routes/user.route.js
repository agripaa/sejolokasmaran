const express = require('express');
const { updateUsers } = require('../controllers/user.controller');
const verifyUser = require('../middleware/auth.middleware');
const router = express.Router();

router.patch('/update', verifyUser, updateUsers);

module.exports = router;