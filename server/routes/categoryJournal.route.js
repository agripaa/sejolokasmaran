const express = require('express');
const { 
    getAll, 
    getOne,
    create, 
    update, 
    deleteCat 
} = require('../controllers/categoryJournal.controller');
const router = express.Router();

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', create);
router.patch('/:id', update);
router.delete('/:id', deleteCat);

module.exports = router;