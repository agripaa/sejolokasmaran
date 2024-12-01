const express = require('express');
const { findAll, create, update, delete: deleteYogaClass } = require('../controllers/classYoga.controller');
const verifyToken = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', verifyToken, findAll);
router.post('/', verifyToken, create);
router.patch('/:id', verifyToken, update);
router.delete('/:id', verifyToken, deleteYogaClass);

module.exports = router;
