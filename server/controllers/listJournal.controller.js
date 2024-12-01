const ListJournal = require('../models/ListJournal');
const PregnancyJournal = require('../models/PregnancyJournal');

module.exports = {
    getAllListJournal: async function (req, res) {
        try {
            const listJournal = await ListJournal.findAll({
                include: [PregnancyJournal]
            });
            if (listJournal.length === 0) {
                return res.status(404).json({ status: 404, msg: "No List Journals found." });
            }
            res.status(200).json({ status: 200, result: listJournal });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching List Journals', details: error });
        }
    },

    getListJournalById: async function (req, res) {
        const { id } = req.params;
        try {
            const listJournal = await ListJournal.findOne({ where: { id } });
            if (!listJournal) {
                return res.status(404).json({ status: 404, msg: "List Journal not found." });
            }
            res.status(200).json({ status: 200, result: listJournal });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching List Journal', details: error });
        }
    },

    getListJournalByPregnancyId: async function(req, res) {
        const { pregnancy_journal_id } = req.params;

        try {
            const listJournal = await ListJournal.findAll({where: { pregnancy_journal_id}});
            if (listJournal.length === 0) {
                return res.status(404).json({ status: 404, msg: "List Journals by pregnancy id Not found." });
            }

            res.status(200).json({status: 200, result: listJournal});
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error creating List Journal', details: error });
        }
    },

    createListJournal: async function (req, res) {
        const { is_required, journal, pregnancy_journal_id } = req.body;

        try {
            const pregnancy_journal = await PregnancyJournal.findOne({where: {id: pregnancy_journal_id}});
            if(!pregnancy_journal) return res.status(404).json({status: 404, msg: "Pregnancy Journal not found!"});
            
            if(!journal) return res.status(401).json({status: 401, msg: "Journal cannot be null!"});

            const newListJournal = await ListJournal.create({
                is_required,
                journal,
                pregnancy_journal_id,
            });

            res.status(201).json({ status: 201, msg: "List Journal created successfully.", result: newListJournal });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error creating List Journal', details: error });
        }
    },

    updateListJournal: async function (req, res) {
        const { id } = req.params;
        const { is_required, journal, pregnancy_journal_id } = req.body;
        
        try {
            if(pregnancy_journal_id) {
                const pregnancy_journal = await PregnancyJournal.findOne({where: {id: pregnancy_journal_id}});
                if(!pregnancy_journal) return res.status(404).json({status: 404, msg: "Pregnancy Journal not found!"});
            }

            const listJournal = await ListJournal.findOne({ where: { id } });
            if (!listJournal) {
                return res.status(404).json({ status: 404, msg: "List Journal not found." });
            }

            await ListJournal.update({ is_required, journal, pregnancy_journal_id }, { where: { id } });

            res.status(200).json({ status: 200, msg: "List Journal updated successfully." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error updating List Journal', details: error });
        }
    },

    deleteListJournal: async function (req, res) {
        const { id } = req.params;

        try {
            const listJournal = await ListJournal.findOne({ where: { id } });
            if (!listJournal) {
                return res.status(404).json({ status: 404, msg: "List Journal not found." });
            }

            await ListJournal.destroy({ where: { id } });

            res.status(200).json({ status: 200, msg: "List Journal deleted successfully." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error deleting List Journal', details: error });
        }
    },
};
