const Posting = require('../models/Posting');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');
const { where } = require('sequelize');

module.exports = {
    getAllPostings: async function (req, res) {
        try {
            const postings = await Posting.findAll({
                include: [{ model: User, attributes: ['username', 'email'] }],
            });

            if (postings.length === 0) {
                return res.status(404).json({ status: 404, msg: 'No postings found.' });
            }

            return res.status(200).json({ status: 200, result: postings });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching postings', details: error });
        }
    },

    getPostingById: async function (req, res) {
        const { id } = req.params;

        try {
            const posting = await Posting.findOne({
                where: { id },
                include: [{ model: User, attributes: ['username', 'email'] }],
            });

            if (!posting) {
                return res.status(404).json({ status: 404, msg: 'Posting not found.' });
            }

            res.status(200).json({ status: 200, result: posting });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching posting', details: error });
        }
    },

    getPostingsByUserId: async function (req, res) {
        const { userId } = req;

        try {
            const postings = await Posting.findAll({
                where: { userId },
                include: [{ model: User, attributes: ['username', 'email'] }],
            });

            if (postings.length === 0) {
                return res.status(404).json({ status: 404, msg: 'No postings found for this user.' });
            }

            res.status(200).json({ status: 200, result: postings });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching postings by userId', details: error });
        }
    },

    getPostingsByUser: async function (req, res) {
        const { userId } = req.params;

        try {
            const postings = await Posting.findAll({
                where: { userId },
                include: [{ model: User, attributes: ['username', 'email'] }],
            });

            if (postings.length === 0) {
                return res.status(404).json({ status: 404, msg: 'No postings found for this user.' });
            }

            res.status(200).json({ status: 200, result: postings });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching postings by userId', details: error });
        }
    },

    createPosting: async function (req, res) {
        const { title, desc } = req.body;
        const { userId } = req;

        if(req.files) {
            if (!req.files.img_path) {
                return res.status(400).json({ status: 400, msg: 'Image file is required.' });
            }

            const imageFile = req.files.img_path;
    
            const allowedExtensions = ['.jpg', '.jpeg', '.png'];
            const fileExtension = path.extname(imageFile.name).toLowerCase();
            if (!allowedExtensions.includes(fileExtension)) {
                return res.status(400).json({ status: 400, msg: 'Invalid file type. Only JPG and PNG are allowed.' });
            }
    
            const uploadPath = path.join(__dirname, '../public/uploads/', imageFile.name);

            try {
                imageFile.mv(uploadPath, async (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ status: 500, msg: 'Error uploading file.' });
                    }
    
                    const posting = await Posting.create({
                        title,
                        desc,
                        img_path: `/uploads/${imageFile.name}`,
                        userId,
                    });
    
                    res.status(201).json({
                        status: 201,
                        msg: 'Posting created successfully.',
                        result: posting,
                    });
                });
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Error creating posting', details: error });
            }
        }

        try {
            const posting = await Posting.create({
                title,
                desc,
                img_path: null,
                userId,
            });

            res.status(201).json({
                status: 201,
                msg: 'Posting created successfully.',
                result: posting,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error creating posting', details: error });
        }

    },

    updatePosting: async function (req, res) {
        const { id } = req.params;
        const { title, desc } = req.body;

        const posting = await Posting.findOne({ where: { id } });
        if (!posting) {
            return res.status(404).json({ status: 404, msg: 'Posting not found.' });
        }

        if(req.files) {
            if (!req.files.img_path) {
                return res.status(400).json({ status: 400, msg: 'Image file is required.' });
            }

            const imageFile = req.files.img_path;
    
            const allowedExtensions = ['.jpg', '.jpeg', '.png'];
            const fileExtension = path.extname(imageFile.name).toLowerCase();
            if (!allowedExtensions.includes(fileExtension)) {
                return res.status(400).json({ status: 400, msg: 'Invalid file type. Only JPG and PNG are allowed.' });
            }
    
            const uploadPath = path.join(__dirname, '../public/uploads/', imageFile.name);

            try {
                imageFile.mv(uploadPath, async (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ status: 500, msg: 'Error uploading file.' });
                    }
    
                    await Posting.update({
                        title,
                        desc,
                        img_path: `/uploads/${imageFile.name}`,
                    }, {where: {id}});
    
                    res.status(201).json({
                        status: 201,
                        msg: 'Posting updated successfully.'
                    });
                });
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Error creating posting', details: error });
            }
        }

        try {

            await Posting.update({ title, desc }, { where: { id } });

            res.status(200).json({ status: 200, msg: 'Posting updated successfully.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error updating posting', details: error });
        }
    },

    deletePosting: async function (req, res) {
        const { id } = req.params;

        try {
            const posting = await Posting.findOne({ where: { id } });
            if (!posting) {
                return res.status(404).json({ status: 404, msg: 'Posting not found.' });
            }

            if (posting.img_path && fs.existsSync(path.join(__dirname, '../public', posting.img_path))) {
                fs.unlinkSync(path.join(__dirname, '../public', posting.img_path));
            }

            await Posting.destroy({ where: { id } });

            res.status(200).json({ status: 200, msg: 'Posting deleted successfully.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error deleting posting', details: error });
        }
    },
};
