const ListClass = require('../models/ListClass');
const LearnList = require('../models/LearnList');
const DetailClass = require('../models/DetailClass');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');

module.exports = {
    getAllListClasses: async function (req, res) {
        try {
            const listClasses = await ListClass.findAll({
                include: [
                    {
                        model: LearnList,
                        attributes: ['title', 'desc'],
                    },
                ],
            });

            if (listClasses.length === 0) {
                return res.status(404).json({ status: 404, msg: "No list classes found." });
            }

            res.status(200).json({ status: 200, result: listClasses });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching list classes', details: error });
        }
    },

    getListClassById: async function (req, res) {
        const { id } = req.params;

        try {
            const listClasses = await ListClass.findAll({
                include: [
                    {
                        model: LearnList,
                        attributes: ['title', 'desc'],
                    },
                ],
                where: { learn_list_id: id }
            });

            if (listClasses.length === 0) {
                return res.status(404).json({ status: 404, msg: "No list classes found." });
            }

            res.status(200).json({ status: 200, result: listClasses });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching list classes', details: error });
        }
    },

    getAvailableClasses: async function (req, res) {
        try {
            // Cari kelas yang belum ada di tabel detail_class
            const classesWithDetails = await DetailClass.findAll({
                attributes: ['list_class_id'],
            });
            const usedClassIds = classesWithDetails.map((item) => item.list_class_id);

            const availableClasses = await ListClass.findAll({
                where: { id: { [Op.notIn]: usedClassIds } },
            });

            res.status(200).json({ status: 200, result: availableClasses });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching available classes', details: error });
        }
    },

    createListClass: async function (req, res) {
        const { title, desc, learn_list_id } = req.body;

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

        const learn_list = await LearnList.findOne({where: {id: learn_list_id}});
        if(!learn_list) return res.status(404).json({status: 404, msg: "Learn List is not found!"});

        try {
            imageFile.mv(uploadPath, async (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ status: 500, msg: "Error uploading file." });
                }

                const listClass = await ListClass.create({
                    img_path: `/uploads/${imageFile.name}`,
                    learn_list_id,
                    title, 
                    desc
                });

                res.status(201).json({
                    status: 201,
                    msg: "List class created successfully.",
                    result: listClass,
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error creating list class', details: error });
        }
    },
    updateListClass: async function (req, res) {
        const { id } = req.params;
        const { title, desc, learn_list_id } = req.body;
    
        const learn_list = await LearnList.findOne({where: {id: learn_list_id}});
        if(!learn_list) return res.status(404).json({status: 404, msg: "Learn List is not found!"});
        
        try {
            const listClass = await ListClass.findOne({ where: { id } });
            if (!listClass) {
                return res.status(404).json({ status: 404, msg: "List class not found." });
            }
    
            let newImagePath = listClass.img_path;
    
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
    
                if (listClass.img_path && fs.existsSync(path.join(__dirname, '../public', listClass.img_path))) {
                    fs.unlinkSync(path.join(__dirname, '../public', listClass.img_path));
                }
    
                newImagePath = `/uploads/${imageFile.name}`;
            }

            await ListClass.update(
                { title, desc, img_path: newImagePath, learn_list_id },
                { where: { id } }
            );
    
            res.status(200).json({ status: 200, msg: "List class updated successfully." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error updating list class', details: error });
        }
    },
    deleteListClass: async function (req, res) {
        const { id } = req.params;
    
        try {
            const listClass = await ListClass.findOne({ where: { id } });
            if (!listClass) {
                return res.status(404).json({ status: 404, msg: "List class not found." });
            }
    
            if (listClass.img_path && fs.existsSync(path.join(__dirname, '../public', listClass.img_path))) {
                fs.unlinkSync(path.join(__dirname, '../public', listClass.img_path));
            }
    
            await ListClass.destroy({ where: { id } });
    
            res.status(200).json({ status: 200, msg: "List class deleted successfully." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error deleting list class', details: error });
        }
    },
    
};
