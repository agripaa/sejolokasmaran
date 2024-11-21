const express = require('express');
const { getAllTrimester, createTrimester, updateTrimester, deleteTrimester } = require('../controllers/trimester.controller');
const verifyToken = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/', getAllTrimester);
router.post('/', verifyToken, createTrimester);
router.patch('/:id', verifyToken, updateTrimester);
router.delete('/:id', verifyToken, deleteTrimester)

module.exports = router;