const express = require('express');
const { getRoles, createRoles, updateRole, deleteRole } = require('../controllers/role.controller');
const router = express.Router();

router.get('/', getRoles);
router.post('/', createRoles);
router.patch('/:id', updateRole);
router.delete('/:id', deleteRole);

module.exports = router;