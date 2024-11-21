const Trimester = require('../models/Trimester');

module.exports = {
    getAllTrimester: async function(req, res) {
        try {
            const trimesters = await Trimester.findAll();
            if(trimesters.length === 0) return res.status(404).json({status: 404, msg: "Trimester is null"}); 

            res.status(200).json({status: 200, result: trimesters});
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error Trimester', details: error });
        }
    },
    createTrimester: async function(req, res){
        const { cat_trimester } = req.body;

        if(!cat_trimester) 
            return res.status(400).json({status: 400, msg: "This field cannot be null"}); 

        try {
            await Trimester.create({cat_trimester});
            res.status(201).json({status: 200, msg: "Trimester created successfully!"});
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error Trimester', details: error });
        }
    },
    updateTrimester: async function(req, res) {
        const { id } = req.params; 
        const { cat_trimester } = req.body;

        if(!cat_trimester) 
            return res.status(400).json({status: 400, msg: "This field cannot be null"}); 

        try {
            const trimester = await Trimester.findOne({where: {id}});
            if(!trimester) return res.status(404).json({status: 200, msg: "trimester is not found!"});

            await Trimester.update({cat_trimester}, {where: {id: trimester.id}});
            res.status(200).json({status: 200, msg: "Trimester updated successfully!"});
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error Trimester', details: error });
        }
    },
    deleteTrimester: async function(req, res) {
        const { id } = req.params;

        try {
            const trimester = await Trimester.findOne({where: {id}});
            if(!trimester) return res.status(404).json({status: 200, msg: "trimester is not found!"});

            await Trimester.destroy({where: {id: trimester.id}});
            res.status(200).json({status: 200, msg: "Trimester updated successfully!"});
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error Trimester', details: error });
        }
    }
}