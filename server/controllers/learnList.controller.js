const path = require('path');
const fs = require('fs');
const LearnList = require('../models/LearnList');
const LearnCategory = require('../models/LearnCategory');

module.exports = {
    getAllLearnLists: async function (req, res) {
        try {
            const learnLists = await LearnList.findAll({
                include: [{ model: LearnCategory, attributes: ['category_name'] }],
            });
            if (learnLists.length === 0) {
                return res.status(404).json({ status: 404, msg: "No learn lists found." });
            }
            res.status(200).json({ status: 200, result: learnLists });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching learn lists', details: error });
        }
    },

    getLearnListById: async function (req, res) {
        const { id } = req.params;
        try {
            const learnList = await LearnList.findOne({
                where: { id },
                include: [{ model: LearnCategory, attributes: ['category_name'] }],
            });
            if (!learnList) {
                return res.status(404).json({ status: 404, msg: "Learn list not found." });
            }
            res.status(200).json({ status: 200, result: learnList });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching learn list', details: error });
        }
    },

    createLearnList: async function (req, res) {
        const { title, category_id } = req.body;

        if (!req.files || !req.files.img_path) {
            return res.status(400).json({ status: 400, msg: "Image file is required." });
        }

        const imageFile = req.files.img_path;
        if (imageFile.size > 10 * 1024 * 1024) {
            return res.status(400).json({ status: 400, msg: "File size must be less than 10MB." });
        }

        const allowedExtensions = ['.jpg', '.jpeg', '.png'];
        const fileExtension = path.extname(imageFile.name).toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
            return res.status(400).json({ status: 400, msg: "Invalid file type. Only JPG and PNG are allowed." });
        }

        const uploadPath = path.join(__dirname, '../public/uploads/', imageFile.name);

        const learn_category = await LearnCategory.findOne({
            where: {id: category_id}
        })
        if(!learn_category) return res.status(404).json({status: 404, msg: "learn category is not found!"});

        try {
            imageFile.mv(uploadPath, async (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ status: 500, msg: "Error uploading file." });
                }

                const learnList = await LearnList.create({
                    title,
                    img_path: `/uploads/${imageFile.name}`,
                    category_id,
                });

                res.status(201).json({
                    status: 201,
                    msg: "Learn list created successfully.",
                    result: learnList,
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error creating learn list', details: error });
        }
    },

    updateLearnList: async function (req, res) {
        const { id } = req.params;
        const { title, category_id } = req.body;
    
        const learn_category = await LearnCategory.findOne({
            where: {id: category_id}
        })
        if(!learn_category) return res.status(404).json({status: 404, msg: "learn category is not found!"});

        try {
            const learnList = await LearnList.findOne({ where: { id } });
            if (!learnList) {
                return res.status(404).json({ status: 404, msg: "Learn list not found." });
            }
    
            let newImagePath = learnList.img_path;
    
            if (req.files && req.files.img_path) {
                const imageFile = req.files.img_path;
    
                if (imageFile.size > 10 * 1024 * 1024) {
                    return res.status(400).json({ status: 400, msg: "File size must be less than 10MB." });
                }
    
                const allowedExtensions = ['.jpg', '.jpeg', '.png'];
                const fileExtension = path.extname(imageFile.name).toLowerCase();
                if (!allowedExtensions.includes(fileExtension)) {
                    return res.status(400).json({ status: 400, msg: "Invalid file type. Only JPG and PNG are allowed." });
                }
    
                const uploadPath = path.join(__dirname, '../public/uploads/', imageFile.name);
    
                imageFile.mv(uploadPath, (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ status: 500, msg: "Error uploading file." });
                    }
                });
    
                if (learnList.img_path && fs.existsSync(path.join(__dirname, '../public', learnList.img_path))) {
                    fs.unlinkSync(path.join(__dirname, '../public', learnList.img_path));
                }
    
                newImagePath = `/uploads/${imageFile.name}`;
            }
    
            await LearnList.update(
                { title, img_path: newImagePath, category_id },
                { where: { id } }
            );
    
            res.status(200).json({ status: 200, msg: "Learn list updated successfully." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error updating learn list', details: error });
        }
    },
    

    deleteLearnList: async function (req, res) {
        const { id } = req.params;

        try {
            const learnList = await LearnList.findOne({ where: { id } });
            if (!learnList) {
                return res.status(404).json({ status: 404, msg: "Learn list not found." });
            }

            await LearnList.destroy({ where: { id } });

            res.status(200).json({ status: 200, msg: "Learn list deleted successfully." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error deleting learn list', details: error });
        }
    },
};
