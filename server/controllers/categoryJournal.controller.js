const CategoryJournal = require('../models/CategoryJournal');

module.exports = {
    getAll: async function(req, res) {
        try {
            const category_journals = await CategoryJournal.findAll();
            if(category_journals.length === 0) return res.status(404).json({status: 404, msg: "datas not found"});
            res.status(200).json({status: 200, result: category_journals});
        } catch (error) {
            console.error(error);
            res.status(500).json({status: 500, msg: error.message})
        }
    },
    getOne: async function (req, res) {
        const { id } = req.params;
        try {
            const category_journal = await CategoryJournal.findOne({where: {id}});
            if(!category_journal) return res.status(404).json({status: 404, msg: "data not found"});
            res.status(200).json({status: 200, result: category_journal});
        } catch (error) {
            console.error(error);
            res.status(500).json({status: 500, msg: error.message})
        }
    },
    create: async function (req, res) {
        const { cat_name } = req.body;
        try {
            await CategoryJournal.create({cat_name});
            res.status(200).json({status: 200, msg: "data created!"});
        } catch (error) {
            console.error(error);
            res.status(500).json({status: 500, msg: error.message})
        }
    },
    update: async function (req, res) {
        const { id } = req.params;
        const { cat_name } = req.body;

        try {
            await CategoryJournal.update({cat_name}, {where: {id}});
            res.status(200).json({status: 200, msg: "data updated!"});
        } catch (error) {
            console.error(error);
            res.status(500).json({status: 500, msg: error.message})
        }
    },
    deleteCat: async function (req, res) {
        const { id } = req.params;

        try {
            await CategoryJournal.destroy({where: {id}});
            res.status(200).json({status: 200, msg: "data deleted!"});
        } catch (error) {
            console.error(error);
            res.status(500).json({status: 500, msg: error.message})
        }
    },
}