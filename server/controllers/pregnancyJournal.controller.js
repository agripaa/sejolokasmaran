const PregnancyJournal = require('../models/PregnancyJournal');
const Trimester = require('../models/Trimester');

module.exports = {
    getAllPregnancy: async function(req, res) {
        try {
            const pregnancy_journals = await PregnancyJournal.findAll({
                include: [Trimester]
            });
            if(pregnancy_journals.length === 0) return res.status(404).json({status: 404, msg: "Pregnancy Journal is null"});

            res.status(200).json({status: 200, result: pregnancy_journals});
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error Pregnancy Journal', details: error });
        }
    },

    createPregnancy: async function(req, res) {
        const { category_jurnal, desc, trimester_id } = req.body;

        try {
            if(!category_jurnal || !desc || !trimester_id) 
                return res.status(400).json({status: 400, msg: "This field cannot be null"});

            const trimester = await Trimester.findOne({where: {id: trimester_id}});
            if(!trimester) return res.status(404).json({status: 404, msg: "Trimester is not defined!"});

            await PregnancyJournal.create({
                category_jurnal,
                desc, 
                trimester_id
            });

            res.status(201).json({status: 201, msg: "pregnancy journal created!"});
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error Pregnancy Journal', details: error });
        }
    },
    updatePregnancy: async function(req, res) {
        const { pregnancy_id } = req.params;
        const { category_jurnal, desc, trimester_id } = req.body;
        
        try {
            const trimester = await Trimester.findOne({where: {id: trimester_id}});
            if(!trimester) return res.status(404).json({status: 404, msg: "Trimester is not defined!"});

            await PregnancyJournal.update({category_jurnal, desc, trimester_id}, {where: {id: pregnancy_id}});
            
            res.status(200).json({status: 200, msg: "pregnancy journal updated successfully!"});
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error Pregnancy Journal', details: error });
        }
    },
    updateNotes: async function(req, res) {
        const { pregnancy_id } = req.params;
        const { notes } = req.body;

        try {
            const pregnancy = await PregnancyJournal.findOne({where: {id: pregnancy_id}});
            if(!pregnancy) return res.status(404).json({status: 404, msg: "Pregnancy Journal is not defined"});

            await PregnancyJournal.update({notes}, {where: {id: pregnancy.id}});
            res.status(200).json({status: 200, msg: "notes updated!"});
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error Pregnancy Journal', details: error });
        }
    },
    deletePregnancy: async function(req, res) {
        const { pregnancy_id } = req.params;
    
        try {
            const pregnancy_journal = await PregnancyJournal.findOne({ where: { id: pregnancy_id } });
            if (!pregnancy_journal) {
                return res.status(404).json({ status: 404, msg: "Pregnancy Journal is not defined!" });
            }
    
            await PregnancyJournal.destroy({ where: { id: pregnancy_id } });
    
            res.status(200).json({ status: 200, msg: "Pregnancy Journal deleted successfully!" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error deleting Pregnancy Journal', details: error });
        }
    }
    
}