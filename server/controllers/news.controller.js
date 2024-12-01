const Author = require('../models/Author');
const News = require('../models/News');
const NewsContent = require('../models/NewsContent');
const path = require('path');

module.exports = {
    getAllNews: async function (req, res) {
        try {
            const news = await News.findAll({
                include: [{
                    model: NewsContent,
                    attributes: ['paragraph', 'position'],
                }],
            });
            if (news.length === 0) return res.status(404).json({ status: 404, msg: "No news found." });

            res.status(200).json({ status: 200, result: news });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching news', details: error });
        }
    },

    getNewsById: async function (req, res) {
        const { id } = req.params;
        try {
            const news = await News.findOne({
                where: { id },
                include: [{
                    model: NewsContent,
                    attributes: ['paragraph', 'position'],
                }],
            });
            if (!news) return res.status(404).json({ status: 404, msg: "News not found." });

            res.status(200).json({ status: 200, result: news });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching news by ID', details: error });
        }
    },

    createNews: async function (req, res) {
        const { title, sub_title, category, release, author_id } = req.body;

        if (!author_id) {
            return res.status(400).json({ status: 400, msg: "Author ID is required." });
        }

        try {
            const author = await Author.findOne({where: {id: author_id}});
            if(!author) return res.status(404).json({status: 404, msg: "Author is not found!"});

            let img_news = null;
            if (req.image) {
                const imagePath = path.join(__dirname, '../public/uploads/', req.image.name);
                await req.image.mv(imagePath);
                img_news = `/uploads/${req.image.name}`;
            }

            const news = await News.create({ img_news, title, sub_title, category, release, author_id });

            res.status(201).json({ status: 201, msg: "News created successfully.", result: news });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error creating news', details: error });
        }
    },

    updateNews: async function (req, res) {
        const { id } = req.params;
        const { title, sub_title, category, release, author_id, content } = req.body;

        try {
            const author = await Author.findOne({where: {id: author_id}});
            if(!author) return res.status(404).json({status: 404, msg: "Author is not found!"});

            const news = await News.findOne({ where: { id } });
            if (!news) return res.status(404).json({ status: 404, msg: "News not found." });

            let img_news = news.img_news;
            if (req.image) {
                const imagePath = path.join(__dirname, '../public/uploads/', req.image.name);
                await req.image.mv(imagePath);
                img_news = `/uploads/${req.image.name}`;
            }

            await news.update({ img_news, title, sub_title, category, release, author_id }, {where: {id}});

            res.status(200).json({ status: 200, msg: "News updated successfully." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error updating news', details: error });
        }
    },

    deleteNews: async function (req, res) {
        const { id } = req.params;

        try {
            const news = await News.findOne({ where: { id } });
            if (!news) return res.status(404).json({ status: 404, msg: "News not found." });

            await News.destroy({ where: { id } });

            res.status(200).json({ status: 200, msg: "News deleted successfully." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error deleting news', details: error });
        }
    },
};
