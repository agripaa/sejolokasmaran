const CategoryJournal = require('../models/CategoryJournal');
const ListJournal = require('../models/ListJournal');
const PregnancyJournal = require('../models/PregnancyJournal');
const Trimester = require('../models/Trimester');

module.exports = {
    getAllPostpartum: async function(req, res) {
        try {
            const postpartum_journals = await PregnancyJournal.findAll({
                include: [Trimester, ListJournal, CategoryJournal],
                where: {cat_journal_id: 3}
            });
            if(postpartum_journals.length === 0) return res.status(404).json({status: 404, msg: "Pregnancy Journal is null"});

            res.status(200).json({status: 200, result: postpartum_journals});
        } catch (error) {
             
            res.status(500).json({ error: 'Error Pregnancy Journal', details: error });
        }
    },

    getBPostpartumById: async function(req, res) {
        try {
            const postpartum_journal = await PregnancyJournal.findOne({
                where: {id},
                include: [Trimester, CategoryJournal],
                where: {cat_journal_id: 2}
            });
            if(!postpartum_journal) return res.status(404).json({status: 404, msg: "Pregnancy Journal is not defined!"});

            res.status(200).json({status: 200, result: postpartum_journal});
        } catch (error) {
             
            res.status(500).json({ error: 'Error Pregnancy Journal', details: error });
        }
    },

    getPostpartumByTrimester: async function (req, res) {
        try {
            const trimesters = await Trimester.findAll({
                include: [
                    {
                        model: PregnancyJournal,
                        include: [ListJournal],
                        where: {cat_journal_id: 1}
                    },
                ],
            });

            const filteredTrimesters = trimesters.filter(
                (trimester) => trimester.PregnancyJournals && trimester.PregnancyJournals.length > 0
            );

            if (filteredTrimesters.length === 0) {
                return res.status(404).json({ status: 404, msg: "No data found!" });
            }

            res.status(200).json({ status: 200, result: filteredTrimesters });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 500, msg: "Error fetching data", details: error });
        }
    },
}