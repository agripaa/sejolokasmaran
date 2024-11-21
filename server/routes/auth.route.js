const express = require('express');
const { register, login, logout, profile }  = require('../controllers/auth.controller');
const verifyToken = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', verifyToken, profile);
router.delete('/logout', verifyToken, logout);

module.exports = router;