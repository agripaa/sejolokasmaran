const Likes = require('../models/Likes');
const Posting = require('../models/Posting');

module.exports = {
    toggleLike: async function (req, res) {
        const { posting_id } = req.body;
        const { userId } = req;
    
        try {
            const posting = await Posting.findOne({ where: { id: posting_id } });
            if (!posting) return res.status(404).json({ status: 404, msg: "Posting not found!" });
    
            const existingLike = await Likes.findOne({ where: { userId, posting_id } });
    
            if (existingLike) {
                await existingLike.destroy();
                await Posting.increment({ count_like: -1 }, { where: { id: posting_id } });
                return res.status(200).json({ status: 200, liked: false, msg: 'Unliked successfully.' });
            }
    
            await Likes.create({ userId, posting_id });
            await Posting.increment({ count_like: 1 }, { where: { id: posting_id } });
            res.status(201).json({ status: 201, liked: true, msg: 'Liked successfully.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error toggling like', details: error });
        }
    },

    getLikesByPostingId: async function (req, res) {
        const { posting_id } = req.params;

        try {
            const likes = await Likes.findAll({ where: { posting_id } });

            if (likes.length === 0) {
                return res.status(404).json({ status: 404, msg: 'No likes found for this posting.' });
            }

            res.status(200).json({ status: 200, result: likes });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching likes', details: error });
        }
    },
};
