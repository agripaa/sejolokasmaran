const express = require('express');
const { getAllListJournal, getListJournalById, getListJournalByPregnancyId, createListJournal, updateListJournal, deleteListJournal } = require('../controllers/listJournal.controller');
const verifyToken = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/', verifyToken, getAllListJournal);
router.get('/:id', verifyToken, getListJournalById);
router.get('/pregnancy/:pregnancy_journal_id', verifyToken, getListJournalByPregnancyId);
router.post('/', verifyToken, createListJournal);
router.patch('/:id', verifyToken, updateListJournal);
router.delete('/:id', verifyToken, deleteListJournal)

module.exports = router;