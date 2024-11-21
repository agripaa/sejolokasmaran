const express = require('express');
const { toggleLike, getLikesByPostingId } = require('../controllers/like.controller');
const verifyToken = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', verifyToken, toggleLike); 
router.get('/:posting_id', verifyToken, getLikesByPostingId); 

module.exports = router;
