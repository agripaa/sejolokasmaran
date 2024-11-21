const express = require('express');
const { getRelationTypes, createRelationType, updateRelationType, deleteRelationType } = require('../controllers/relationType.controller');
const router = express.Router();

router.get('/', getRelationTypes);
router.post('/', createRelationType);
router.patch('/:id', updateRelationType);
router.delete('/:id', deleteRelationType);

module.exports = router;