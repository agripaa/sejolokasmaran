const DetailClass = require('../models/DetailClass');
const ListClass = require('../models/ListClass');

module.exports = {
    getAllDetailClasses: async function (req, res) {
        try {
            const detailClasses = await DetailClass.findAll({
                include: [{ model: ListClass, attributes: ['title'] }],
            });

            if (detailClasses.length === 0) {
                return res.status(404).json({ status: 404, msg: "No detail classes found." });
            }

            res.status(200).json({ status: 200, result: detailClasses });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching detail classes', details: error });
        }
    },

    createDetailClass: async function (req, res) {
        const { list_class_id, desc } = req.body;

        if (!list_class_id || !desc) {
            return res.status(400).json({ status: 400, msg: "All fields are required." });
        }

        try {
            const detailClass = await DetailClass.create({ list_class_id, desc });
            res.status(201).json({
                status: 201,
                msg: "Detail class created successfully.",
                result: detailClass,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error creating detail class', details: error });
        }
    },

    updateDetailClass: async function (req, res) {
        const { id } = req.params;
        const { list_class_id, desc } = req.body;

        if (!list_class_id || !desc) {
            return res.status(400).json({ status: 400, msg: "All fields are required." });
        }

        try {
            const detailClass = await DetailClass.findOne({ where: { id } });
            if (!detailClass) {
                return res.status(404).json({ status: 404, msg: "Detail class not found." });
            }

            await DetailClass.update({ list_class_id, desc }, { where: { id } });

            res.status(200).json({ status: 200, msg: "Detail class updated successfully." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error updating detail class', details: error });
        }
    },

    deleteDetailClass: async function (req, res) {
        const { id } = req.params;

        try {
            const detailClass = await DetailClass.findOne({ where: { id } });
            if (!detailClass) {
                return res.status(404).json({ status: 404, msg: "Detail class not found." });
            }

            await DetailClass.destroy({ where: { id } });

            res.status(200).json({ status: 200, msg: "Detail class deleted successfully." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error deleting detail class', details: error });
        }
    },
};
