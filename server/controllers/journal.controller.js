const CategoryJournal = require('../models/CategoryJournal');
const ListJournal = require('../models/ListJournal');
const PregnancyJournal = require('../models/PregnancyJournal');
const Trimester = require('../models/Trimester');

module.exports = {
    getAllJournal: async function(req, res) {
        try {
            const journal = await PregnancyJournal.findAll({
                include: [Trimester, ListJournal, CategoryJournal],
            });
            if(journal.length === 0) return res.status(404).json({status: 404, msg: "Pregnancy Journal is null"});

            res.status(200).json({status: 200, result: journal});
        } catch (error) {
            res.status(500).json({ error: 'Error Pregnancy Journal', details: error });
        }
    },
    createJournal: async function(req, res) {
        const { category_jurnal, trimester_id, cat_journal_id } = req.body;

        try {
            if(!category_jurnal || !trimester_id) 
                return res.status(400).json({status: 400, msg: "This field cannot be null"});

            const trimester = await Trimester.findOne({where: {id: trimester_id}});
            if(!trimester) return res.status(404).json({status: 404, msg: "Trimester is not defined!"});

            const pregnancyJournalNew = await PregnancyJournal.create({
                category_jurnal,
                trimester_id,
                cat_journal_id
            });

            res.status(201).json({status: 201, msg: "pregnancy journal created!", result: pregnancyJournalNew});
        } catch (error) {
             
            res.status(500).json({ error: 'Error Pregnancy Journal', details: error });
        }
    },
    updateJournal: async function(req, res) {
        const { journal_id } = req.params;
        const { category_jurnal, trimester_id, cat_journal_id } = req.body;
        
        try {
            const trimester = await Trimester.findOne({where: {id: trimester_id}});
            if(!trimester) return res.status(404).json({status: 404, msg: "Trimester is not defined!"});

            await PregnancyJournal.update({category_jurnal, trimester_id, cat_journal_id}, {where: {id: journal_id}});
            
            res.status(200).json({status: 200, msg: "pregnancy journal updated successfully!"});
        } catch (error) {
            res.status(500).json({ error: 'Error Pregnancy Journal', details: error });
        }
    },
    updateNotes: async function(req, res) {
        const { journal_id } = req.params;
        const { notes } = req.body;

        try {
            const pregnancy = await PregnancyJournal.findOne({where: {id: journal_id}});
            if(!pregnancy) return res.status(404).json({status: 404, msg: "Pregnancy Journal is not defined"});

            await PregnancyJournal.update({notes}, {where: {id: pregnancy.id}});
            res.status(200).json({status: 200, msg: "notes updated!"});
        } catch (error) {
             
            res.status(500).json({ error: 'Error Pregnancy Journal', details: error });
        }
    },
    deleteJournal: async function(req, res) {
        const { journal_id } = req.params;
    
        try {
            const pregnancy_journal = await PregnancyJournal.findOne({ where: { id: journal_id } });
            if (!pregnancy_journal) {
                return res.status(404).json({ status: 404, msg: "Pregnancy Journal is not defined!" });
            }
    
            await PregnancyJournal.destroy({ where: { id: journal_id } });
    
            res.status(200).json({ status: 200, msg: "Pregnancy Journal deleted successfully!" });
        } catch (error) {
             
            res.status(500).json({ error: 'Error deleting Pregnancy Journal', details: error });
        }
    }
    
}