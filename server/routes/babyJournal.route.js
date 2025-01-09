const express = require('express');
const { getAllBaby, getBabyById, getBabyByTrimester, upBornDate } = require('../controllers/babyJournal.controller');
const verifyToken = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/', getAllBaby);
router.get('/journals',verifyToken, getBabyById)
router.get('/:id', getBabyByTrimester);
router.patch('/add-born', verifyToken, upBornDate);

module.exports = router;