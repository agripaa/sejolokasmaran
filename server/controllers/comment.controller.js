const Comment = require('../models/Comment');
const Posting = require('../models/Posting');
const User = require('../models/User');

module.exports = {
    getAllComments: async function (req, res) {
        try {
            const comments = await Comment.findAll({
                where: {comment_id: null},
                include: [
                    { model: User, attributes: ['username', 'email'] },
                    { model: Comment, as: 'Replies' },
                ],
            });

            if (comments.length === 0) {
                return res.status(404).json({ status: 404, msg: 'No comments found.' });
            }

            res.status(200).json({ status: 200, result: comments });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching comments', details: error });
        }
    },

    getCommentById: async function (req, res) {
        const { id } = req.params;

        try {
            const comment = await Comment.findOne({
                where: { id, comment_id: null },
                include: [
                    { model: User, attributes: ['username', 'email'] },
                    { model: Comment, as: 'Replies' },
                ],
            });

            if (!comment) {
                return res.status(404).json({ status: 404, msg: 'Comment not found.' });
            }

            res.status(200).json({ status: 200, result: comment });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching comment by ID', details: error });
        }
    },

    getCommentsByPostingId: async function (req, res) {
        const { posting_id } = req.params;

        try {
            const comments = await Comment.findAll({
                where: { posting_id, comment_id: null },
                include: [
                    { model: User, attributes: ['username', 'email'] },
                    { model: Comment, as: 'Replies' },
                ],
            });

            if (comments.length === 0) {
                return res.status(404).json({ status: 404, msg: 'No comments found for this posting.' });
            }

            res.status(200).json({ status: 200, result: comments });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching comments by posting ID', details: error });
        }
    },

    getCommentsByUserId: async function (req, res) {
        const { userId } = req.params;

        try {
            const comments = await Comment.findAll({
                where: { userId, comment_id: null },
                include: [
                    { model: User, attributes: ['username', 'email'] },
                    { model: Comment, as: 'Replies' },
                ],
            });

            if (comments.length === 0) {
                return res.status(404).json({ status: 404, msg: 'No comments found for this user.' });
            }

            res.status(200).json({ status: 200, result: comments });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching comments by user ID', details: error });
        }
    },

    createComment: async function (req, res) {
        const { content, posting_id } = req.body;
        const { userId } = req;

        try {   
            const posting = await Posting.findOne({where: {id: posting_id}});
            if(!posting) return res.status(404).json({status: 404, msg: "Posting not found!"});

            if(!content) return res.status(400).json({status: 400, msg: "Content cannot be null"});
            
            const comment = await Comment.create({ content, posting_id, userId });
            res.status(201).json({ status: 201, msg: 'Comment added successfully.', result: comment });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error adding comment', details: error });
        }
    },

    replyComment: async function (req, res) {
        const { content, posting_id, comment_id } = req.body;
        const { userId } = req;

        try {
            const posting = await Posting.findOne({where: {id: posting_id}});
            if(!posting) return res.status(404).json({status: 404, msg: "Posting not found!"});

            const comment = await Comment.findOne({where: {id: comment_id}});
            if(!comment) return res.status(404).json({status: 404, msg: "Comment not found!"});

            if(!content) return res.status(400).json({status: 400, msg: "Content cannot be null"});

            const reply = await Comment.create({ content, posting_id, userId, comment_id });
            res.status(201).json({ status: 201, msg: 'Reply added successfully.', result: reply });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error adding reply', details: error });
        }
    },

    updateComment: async function (req, res) {
        const { id } = req.params;
        const { content } = req.body;

        try {
            const comment = await Comment.findOne({ where: { id } });
            if (!comment) {
                return res.status(404).json({ status: 404, msg: 'Comment not found.' });
            }

            await Comment.update({ content }, { where: { id } });

            res.status(200).json({ status: 200, msg: 'Comment updated successfully.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error updating comment', details: error });
        }
    },

    deleteComment: async function (req, res) {
        const { id } = req.params;
    
        try {
            const comment = await Comment.findOne({ where: { id } });
            if (!comment) {
                return res.status(404).json({ status: 404, msg: 'Comment not found.' });
            }
    
            await Comment.destroy({ where: { comment_id: id } });
            await Comment.destroy({ where: { id } });
    
            res.status(200).json({ status: 200, msg: 'Comment and its related replies deleted successfully.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error deleting comment or reply', details: error });
        }
    },
};
