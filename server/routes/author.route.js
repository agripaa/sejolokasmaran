const express = require('express');
const authorController = require('../controllers/author.controller');
const verifyToken = require('../middleware/auth.middleware');
const uploadImage = require('../middleware/uploadImage.middleware'); 

const router = express.Router();

router.get('/', verifyToken, authorController.getAllAuthors);
router.get('/:id', verifyToken, authorController.getAuthorById);
router.post('/', verifyToken, uploadImage, authorController.createAuthor);
router.patch('/:id', verifyToken, uploadImage, authorController.updateAuthor);
router.delete('/:id', verifyToken, authorController.deleteAuthor);

module.exports = router;
