const express = require('express');
const { getAllPregnancy, getPregnancyById,createPregnancy, updatePregnancy, updateNotes, deletePregnancy } = require('../controllers/pregnancyJournal.controller');
const verifyToken = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/', getAllPregnancy);
router.get('/:id', getPregnancyById);
router.post('/', verifyToken, createPregnancy);
router.patch('/:pregnancy_id', verifyToken, updatePregnancy);
router.patch('/notes/:pregnancy_id', verifyToken, updateNotes);
router.delete('/:pregnancy_id', verifyToken, deletePregnancy)

module.exports = router;