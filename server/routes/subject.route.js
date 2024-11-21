const express = require('express');
const {
    getAllSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
} = require('../controllers/subject.controller');
const verifyToken = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', verifyToken, getAllSubjects);
router.post('/', verifyToken, createSubject);
router.patch('/:id', verifyToken, updateSubject);
router.delete('/:id', verifyToken, deleteSubject);

module.exports = router;
