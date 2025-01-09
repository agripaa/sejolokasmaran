const express = require('express');
const newsController = require('../controllers/news.controller');
const verifyToken = require('../middleware/auth.middleware');
const uploadImage = require('../middleware/uploadImage.middleware'); 

const router = express.Router();

router.get('/', newsController.getAllNews);
router.get('/:id', newsController.getNewsById);
router.post('/', verifyToken, uploadImage, newsController.createNews);
router.patch('/:id', verifyToken, uploadImage, newsController.updateNews);
router.delete('/:id', verifyToken, newsController.deleteNews);

module.exports = router;
