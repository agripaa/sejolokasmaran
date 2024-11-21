const express = require('express');
const {
    getAllContentsByNewsId,
    createContent,
    updateContent,
    deleteContent,
} = require('../controllers/newsContent.controller');
const verifyToken = require('../middleware/auth.middleware'); 

const router = express.Router();

router.get('/:news_id/content', verifyToken, getAllContentsByNewsId); 
router.post('/:news_id/content', verifyToken, createContent);         
router.patch('/content/:id', verifyToken, updateContent);              
router.delete('/content/:id', verifyToken, deleteContent);           

module.exports = router;
