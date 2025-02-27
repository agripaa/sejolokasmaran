const Trimester = require('../models/Trimester');

module.exports = {
    getAllTrimester: async function(req, res) {
        try {
            const trimesters = await Trimester.findAll();
            if(trimesters.length === 0) return res.status(404).json({status: 404, msg: "Trimester is null"}); 

            res.status(200).json({status: 200, result: trimesters});
        } catch (error) {
             
            res.status(500).json({ error: 'Error Trimester', details: error });
        }
    },
    createTrimester: async function(req, res){
        const { cat_trimester, desc, postpartum_desc, baby_desc} = req.body;

        if(!cat_trimester) 
            return res.status(400).json({status: 400, msg: "This field cannot be null"}); 

        try {
            const trimester = await Trimester.findOne({where: { cat_trimester }});
            if(trimester) return res.status(401).json({status: 401, msg: "Trimester sudah tersedia!"});

            await Trimester.create({cat_trimester, desc, postpartum_desc, baby_desc});
            res.status(201).json({status: 200, msg: "Trimester created successfully!"});
        } catch (error) {
             
            res.status(500).json({ error: 'Error Trimester', details: error });
        }
    },
    updateTrimester: async function(req, res) {
        const { id } = req.params; 
        const { cat_trimester, desc, postpartum_desc, baby_desc} = req.body;

        if(!cat_trimester) 
            return res.status(400).json({status: 400, msg: "This field cannot be null"}); 

        try {
            const trimester = await Trimester.findOne({where: {id}});
            if(!trimester) return res.status(404).json({status: 200, msg: "trimester is not found!"});

            await Trimester.update({desc, postpartum_desc, baby_desc}, {where: {id: trimester.id}});
            res.status(200).json({status: 200, msg: "Trimester updated successfully!"});
        } catch (error) {
             
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
             
            res.status(500).json({ error: 'Error Trimester', details: error });
        }
    }
}