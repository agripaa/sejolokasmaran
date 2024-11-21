const RelationType = require('../models/RelationType');

module.exports = {
    createRelationType: async function(req, res) {
        const { name_relation } = req.body;

        try {
            const relationType = await RelationType.create({ name_relation });
            res.status(201).json({ message: 'Relation type created successfully', relationType });
        } catch (error) {
            res.status(500).json({ error: 'Error creating relation type', details: error });
        }
    },
    getRelationTypes: async function(req, res) {
        try {
            const relationTypes = await RelationType.findAll();
            res.status(200).json(relationTypes);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching relation types', details: error });
        }
    },
    updateRelationType: async function(req, res) {
        const { id } = req.params;
        const { name_relation } = req.body;
    
        try {
            await RelationType.update({ name_relation }, { where: { id } });
            res.status(200).json({ message: 'Relation type updated successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Error updating relation type', details: error });
        }
    },
    deleteRelationType: async function(req, res) {
        const { id } = req.params;

        try {
            await RelationType.destroy({ where: { id } });
            res.status(200).json({ message: 'Relation type deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Error deleting relation type', details: error });
        }
    },
};
