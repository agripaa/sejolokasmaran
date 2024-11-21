const Checked = require('../models/Checked');
const ListJournal = require('../models/ListJournal');

module.exports = {
    getAllChecked: async function(req, res) {
        try {
            const checkeds = await Checked.findAll();
            if(checkeds.length === 0) return res.status(404).json({status: 404, msg: "Checked is not found!"});
            
            res.status(200).json({status: 200, result: checkeds});
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error Checked', details: error });
        }
    },
    getCheckedById: async function(req, res) {
        const { id } = req.params;
    
        try {
            const checked = await Checked.findOne({
                where: {id}
            });
            if(!checked) return res.status(404).json({status: 404, msg: "Checked is not found!"});

            res.status(200).json({status: 200, result: checked});
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching List Journals', details: error });
        }
    },
    getCheckedByListJournal: async function (req, res) {
        const { userId } = req;
        const { list_journal_id } = req.params;

        try {
            const checked_journal = await Checked.findOne({
                where: {list_journal_id, userId}
            });

            if(!checked_journal) return res.status(404).json({status: 404, result: null, msg: "user not checked in this list"});

            return res.status(200).json({status: 200, result: checked_journal});
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching List Journals', details: error });
        }
    },
    checkedListJournal: async function (req, res) {
        const { userId } = req;
        const { list_journal_id } = req.params;

        try {
            const list_journal = await ListJournal.findOne({
                where: {id: list_journal_id}
            });
            if(!list_journal) return res.status(404).json({status: 404, msg: "List Journal not found!"});

            const checked_journal = await Checked.findOne({
                where: {list_journal_id, userId}
            });

            if(checked_journal){
                if(checked_journal.is_checked === true) {
                    await Checked.update({is_checked: false}, {where: {id: checked_journal.id}});
                    return res.status(200).json({status: 200, msg: "List unchecked done!"});
                } else {
                    await Checked.update({is_checked: true}, {where: {id: checked_journal.id}});
                    return res.status(200).json({status: 200, msg: "List checked done!"});
                }
            }

            await Checked.create({is_checked: true, userId, list_journal_id});
            return res.status(201).json({status: 201, msg: "created list checked done!"})
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching List Journals', details: error });
        }
    }
}