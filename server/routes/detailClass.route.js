const express = require('express');
const {
    getAllDetailClasses,
    createDetailClass,
    updateDetailClass,
    deleteDetailClass,
} = require('../controllers/detailClass.controller');
const verifyToken = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', verifyToken, getAllDetailClasses);
router.post('/', verifyToken, createDetailClass);
router.patch('/:id', verifyToken, updateDetailClass);
router.delete('/:id', verifyToken, deleteDetailClass);

module.exports = router;
