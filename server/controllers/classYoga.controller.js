const ClassYoga = require('../models/ClassYoga');

module.exports = {
    findAll: async (req, res) => {
        try {
            const yogaClasses = await ClassYoga.findAll();
            res.status(200).json({ status: 200, result: yogaClasses });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch yoga classes', details: error });
        }
    },

    create: async (req, res) => {
        const { url_link } = req.body;

        if (!url_link) {
            return res.status(400).json({ status: 400, msg: 'URL Link is required' });
        }

        try {
            const newYogaClass = await ClassYoga.create({ url_link });
            res.status(201).json({ status: 201, msg: 'Yoga class created successfully', result: newYogaClass });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create yoga class', details: error });
        }
    },

    update: async (req, res) => {
        const { id } = req.params;
        const { url_link } = req.body;

        if (!url_link) {
            return res.status(400).json({ status: 400, msg: 'URL Link is required' });
        }

        try {
            const yogaClass = await ClassYoga.findOne({ where: { id } });

            if (!yogaClass) {
                return res.status(404).json({ status: 404, msg: 'Yoga class not found' });
            }

            await ClassYoga.update({ url_link }, { where: { id } });
            res.status(200).json({ status: 200, msg: 'Yoga class updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update yoga class', details: error });
        }
    },

    delete: async (req, res) => {
        const { id } = req.params;

        try {
            const yogaClass = await ClassYoga.findOne({ where: { id } });

            if (!yogaClass) {
                return res.status(404).json({ status: 404, msg: 'Yoga class not found' });
            }

            await ClassYoga.destroy({ where: { id } });
            res.status(200).json({ status: 200, msg: 'Yoga class deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete yoga class', details: error });
        }
    },
};
