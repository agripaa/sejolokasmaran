const express = require('express');
const { getAllPregnancy, getPregnancyByTrimester, getPregnancyById } = require('../controllers/pregnancyJournal.controller');
const verifyToken = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/', getAllPregnancy);
router.get('/journals',verifyToken, getPregnancyByTrimester)
router.get('/:id', getPregnancyById);

module.exports = router;