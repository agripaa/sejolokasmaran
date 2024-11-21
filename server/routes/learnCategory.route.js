const express = require('express');
const {
    getAllLearnCategories,
    getLearnCategoryById,
    createLearnCategory,
    updateLearnCategory,
    deleteLearnCategory,
} = require('../controllers/learnCategory.controller');
const verifyToken = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', verifyToken, getAllLearnCategories);
router.get('/:id', verifyToken, getLearnCategoryById);
router.post('/', verifyToken, createLearnCategory);
router.patch('/:id', verifyToken, updateLearnCategory);
router.delete('/:id', verifyToken, deleteLearnCategory);

module.exports = router;
