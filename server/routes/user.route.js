const express = require('express');
const { getUsers, updateUsers, getMonthlyUserCount } = require('../controllers/user.controller');
const verifyUser = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/', verifyUser, getUsers);
router.get('/monthly-users', verifyUser, getMonthlyUserCount);
router.patch('/update', verifyUser, updateUsers);

module.exports = router;