const express = require('express');
const { getAllPostpartum, getBPostpartumById, getPostpartumByTrimester } = require('../controllers/postpartumJournal.controller');
const verifyToken = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/', getAllPostpartum);
router.get('/journals',verifyToken, getBPostpartumById)
router.get('/:id', getPostpartumByTrimester);

module.exports = router;