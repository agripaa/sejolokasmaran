const NewsContent = require('../models/NewsContent');
const News = require('../models/News');

module.exports = {
    getAllContentsByNewsId: async function (req, res) {
        const { news_id } = req.params;

        try {
            const contents = await NewsContent.findAll({ where: { news_id }, order: [['position', 'ASC']] });

            if (contents.length === 0) {
                return res.status(404).json({ status: 404, msg: 'No contents found for this news.' });
            }

            res.status(200).json({ status: 200, result: contents });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching news contents', details: error });
        }
    },

    createContent: async function (req, res) {
        const { news_id } = req.params; 
        const { paragraph, position } = req.body;
    
        try {
            console.log(`Received request for news_id ${news_id} with data:`, { paragraph, position });
    
            // Check if the news exists
            const news = await News.findOne({ where: { id: news_id } });
            if (!news) {
                console.error(`News with ID ${news_id} not found.`);
                return res.status(404).json({ status: 404, msg: 'News not found.' });
            }
    
            // Validate required fields
            if (!paragraph || !position) {
                console.error('Invalid data:', { paragraph, position });
                return res.status(400).json({ status: 400, msg: 'Paragraph and position are required.' });
            }
    
            // Check for duplicate positions
            const existingContent = await NewsContent.findOne({ where: { news_id, position } });
            if (existingContent) {
                console.error(`Position ${position} already exists for news ID ${news_id}.`);
                return res.status(400).json({
                    status: 400,
                    msg: `Position ${position} already exists for this news. Please use a different position.`,
                });
            }
    
            // Insert the content
            const content = await NewsContent.create({ news_id, paragraph, position });
            console.log(`Content created successfully:`, content);
    
            res.status(201).json({
                status: 201,
                msg: 'News content created successfully.',
                result: content,
            });
        } catch (error) {
            console.error('Error creating news content:', error);
            res.status(500).json({ error: 'Error creating news content', details: error });
        }
    },

    updateContent: async function (req, res) {
        const { id } = req.params;
        const { paragraph, position } = req.body;

        try {
            const content = await NewsContent.findOne({ where: { id } });
            if (!content) {
                return res.status(404).json({ status: 404, msg: 'News content not found.' });
            }

            // Check if the new position already exists for the same news
            const existingContent = await NewsContent.findOne({ 
                where: { news_id: content.news_id, position, id: { $ne: id } } 
            });
            if (existingContent) {
                return res.status(400).json({ 
                    status: 400, 
                    msg: `Position ${position} already exists for this news. Please use a different position.` 
                });
            }

            await NewsContent.update({ paragraph, position }, { where: { id } });

            res.status(200).json({ status: 200, msg: 'News content updated successfully.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error updating news content', details: error });
        }
    },

    deleteContent: async function (req, res) {
        const { id } = req.params;

        try {
            const content = await NewsContent.findOne({ where: { id } });
            if (!content) {
                return res.status(404).json({ status: 404, msg: 'News content not found.' });
            }

            await NewsContent.destroy({ where: { id } });

            res.status(200).json({ status: 200, msg: 'News content deleted successfully.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error deleting news content', details: error });
        }
    },
};
