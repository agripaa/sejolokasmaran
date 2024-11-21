const express = require('express');
const { getAllChecked, getCheckedById, getCheckedByListJournal, checkedListJournal } = require('../controllers/checked.controller');
const verifyToken = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/', verifyToken, getAllChecked);
router.get('/:id', verifyToken, getCheckedById);
router.get('/list/:list_journal_id', verifyToken, getCheckedByListJournal);
router.post('/:list_journal_id', verifyToken, checkedListJournal);

module.exports = router;