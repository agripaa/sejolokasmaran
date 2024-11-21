const express = require('express');
const {
    getAllLearnLists,
    getLearnListById,
    createLearnList,
    updateLearnList,
    deleteLearnList,
} = require('../controllers/learnList.controller');
const verifyToken = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', verifyToken, getAllLearnLists);
router.get('/:id', verifyToken, getLearnListById);
router.post('/', verifyToken, createLearnList);
router.patch('/:id', verifyToken, updateLearnList);
router.delete('/:id', verifyToken, deleteLearnList);

module.exports = router;
