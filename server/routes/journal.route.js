const express = require('express');
const { getAllJournal, createJournal, updateJournal, updateNotes, deleteJournal } = require('../controllers/journal.controller');
const verifyToken = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/', verifyToken, getAllJournal);
router.post('/', verifyToken, createJournal);
router.patch('/:journal_id', verifyToken, updateJournal);
router.patch('/notes/:journal_id', verifyToken, updateNotes);
router.delete('/:journal_id', verifyToken, deleteJournal)

module.exports = router;