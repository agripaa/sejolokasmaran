const express = require('express');
const { getAllListClasses, getListClassById, createListClass, getAvailableClasses, updateListClass, deleteListClass } = require('../controllers/listClass.controller');
const verifyToken = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/', verifyToken, getAllListClasses);
router.get('/data/:id', verifyToken, getListClassById);
router.post('/', verifyToken, createListClass);
router.get('/available', getAvailableClasses);
router.patch('/:id', verifyToken, updateListClass); 
router.delete('/:id', verifyToken, deleteListClass); 

module.exports = router;