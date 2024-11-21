const express = require('express');
const {
    getAllPostings,
    getPostingById,
    getPostingsByUserId,
    getPostingsByUser,
    createPosting,
    updatePosting,
    deletePosting,
} = require('../controllers/posting.controller');
const verifyToken = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', verifyToken, getAllPostings);
router.get('/:id', verifyToken, getPostingById);
router.get('/userId/verify', verifyToken, getPostingsByUserId);
router.get('/user/:userId', verifyToken, getPostingsByUser);
router.post('/', verifyToken, createPosting);
router.patch('/:id', verifyToken, updatePosting);
router.delete('/:id', verifyToken, deletePosting);

module.exports = router;
