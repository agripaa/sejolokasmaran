const LearnCategory = require('../models/LearnCategory');

module.exports = {
    getAllLearnCategories: async function (req, res) {
        try {
            const categories = await LearnCategory.findAll();
            if (categories.length === 0) {
                return res.status(404).json({ status: 404, msg: "No categories found." });
            }
            res.status(200).json({ status: 200, result: categories });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching categories', details: error });
        }
    },

    getLearnCategoryById: async function (req, res) {
        const { id } = req.params;
        try {
            const category = await LearnCategory.findOne({ where: { id } });
            if (!category) {
                return res.status(404).json({ status: 404, msg: "Category not found." });
            }
            res.status(200).json({ status: 200, result: category });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching category', details: error });
        }
    },

    createLearnCategory: async function (req, res) {
        const { category_name } = req.body;

        if (!category_name) {
            return res.status(400).json({ status: 400, msg: "Category name is required." });
        }

        try {
            const category = await LearnCategory.create({ category_name });
            res.status(201).json({ status: 201, msg: "Category created successfully.", result: category });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error creating category', details: error });
        }
    },

    updateLearnCategory: async function (req, res) {
        const { id } = req.params;
        const { category_name } = req.body;

        if (!category_name) {
            return res.status(400).json({ status: 400, msg: "Category name is required." });
        }

        try {
            const category = await LearnCategory.findOne({ where: { id } });
            if (!category) {
                return res.status(404).json({ status: 404, msg: "Category not found." });
            }

            await LearnCategory.update({ category_name }, { where: { id } });

            res.status(200).json({ status: 200, msg: "Category updated successfully." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error updating category', details: error });
        }
    },

    deleteLearnCategory: async function (req, res) {
        const { id } = req.params;

        try {
            const category = await LearnCategory.findOne({ where: { id } });
            if (!category) {
                return res.status(404).json({ status: 404, msg: "Category not found." });
            }

            await LearnCategory.destroy({ where: { id } });

            res.status(200).json({ status: 200, msg: "Category deleted successfully." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error deleting category', details: error });
        }
    },
};
