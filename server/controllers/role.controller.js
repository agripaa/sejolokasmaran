const express = require('express');
const Roles = require('../models/Roles');

module.exports = {
    createRoles: async function(req, res) {
        const { role_name } = req.body;

        try {
            const role = await Roles.create({ role_name });
            res.status(201).json({ message: 'Role created successfully', role });
        } catch (error) {
            res.status(500).json({ error: 'Error creating role', details: error });
        }
    },
    getRoles: async function(req, res) {
        try {
            const roles = await Roles.findAll();
            res.status(200).json(roles);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching roles', details: error });
        }
    },
    updateRole: async function(req, res) {
        const { id } = req.params;
        const { role_name } = req.body;
    
        try {
            await Roles.update({ role_name }, { where: { id } });
            res.status(200).json({ message: 'Role updated successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Error updating role', details: error });
        }
    },
    deleteRole: async function(req, res) {
        const { id } = req.params;

        try {
            await Roles.destroy({ where: { id } });
            res.status(200).json({ message: 'Role deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Error deleting role', details: error });
        }
    }
};

