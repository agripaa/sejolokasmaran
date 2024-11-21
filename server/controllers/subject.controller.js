const Subject = require('../models/Subject');
const DetailClass = require('../models/DetailClass');
const path = require('path');

module.exports = {
    getAllSubjects: async function (req, res) {
        try {
            const subjects = await Subject.findAll({
                include: [{ model: DetailClass, attributes: ['desc'] }],
            });

            if (subjects.length === 0) {
                return res.status(404).json({ status: 404, msg: "No subjects found." });
            }

            res.status(200).json({ status: 200, result: subjects });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching subjects', details: error });
        }
    },

    createSubject: async function (req, res) {
        const { detail_class_id } = req.body;

        if (!detail_class_id || !req.files || !req.files.sub_lear_path) {
            return res.status(400).json({ status: 400, msg: "All fields are required, including file." });
        }

        const file = req.files.sub_lear_path;

        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.mp4', '.avi'];
        const fileExtension = path.extname(file.name).toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
            return res.status(400).json({ status: 400, msg: "Invalid file type. Allowed types: JPG, PNG, PDF, MP4, AVI." });
        }

        const uploadPath = path.join(__dirname, '../public/uploads/', file.name);

        try {
            file.mv(uploadPath, async (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ status: 500, msg: "Error uploading file." });
                }

                const subject = await Subject.create({
                    detail_class_id,
                    sub_lear_path: `/uploads/${file.name}`,
                });

                res.status(201).json({
                    status: 201,
                    msg: "Subject created successfully.",
                    result: subject,
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error creating subject', details: error });
        }
    },


    updateSubject: async function (req, res) {
        const { id } = req.params;
        const { detail_class_id } = req.body;

        try {
            const subject = await Subject.findOne({ where: { id } });
            if (!subject) {
                return res.status(404).json({ status: 404, msg: "Subject not found." });
            }

            let newFilePath = subject.sub_lear_path;

            if (req.files && req.files.sub_lear_path) {
                const file = req.files.sub_lear_path;

                const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.mp4', '.avi'];
                const fileExtension = path.extname(file.name).toLowerCase();
                if (!allowedExtensions.includes(fileExtension)) {
                    return res.status(400).json({ status: 400, msg: "Invalid file type. Allowed types: JPG, PNG, PDF, MP4, AVI." });
                }

                const uploadPath = path.join(__dirname, '../public/uploads/', file.name);

                file.mv(uploadPath, (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ status: 500, msg: "Error uploading file." });
                    }
                });

                newFilePath = `/uploads/${file.name}`;
            }

            await Subject.update(
                { detail_class_id, sub_lear_path: newFilePath },
                { where: { id } }
            );

            res.status(200).json({ status: 200, msg: "Subject updated successfully." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error updating subject', details: error });
        }
    },

    deleteSubject: async function (req, res) {
        const { id } = req.params;

        try {
            const subject = await Subject.findOne({ where: { id } });
            if (!subject) {
                return res.status(404).json({ status: 404, msg: "Subject not found." });
            }

            await Subject.destroy({ where: { id } });

            res.status(200).json({ status: 200, msg: "Subject deleted successfully." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error deleting subject', details: error });
        }
    },
};
