const express = require('express');
const {
    getAllComments,
    getCommentById,
    getCommentsByPostingId,
    getCommentsByUserId,
    createComment,
    replyComment,
    updateComment,
    deleteComment,
} = require('../controllers/comment.controller');
const verifyToken = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', verifyToken, getAllComments); 
router.get('/:id', verifyToken, getCommentById); 
router.get('/posting/:posting_id', verifyToken, getCommentsByPostingId); 
router.get('/user/:userId', verifyToken, getCommentsByUserId); 
router.post('/', verifyToken, createComment); 
router.post('/reply', verifyToken, replyComment); 
router.patch('/:id', verifyToken, updateComment); 
router.delete('/:id', verifyToken, deleteComment); 

module.exports = router;
