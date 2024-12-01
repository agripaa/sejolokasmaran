const { Op } = require('sequelize');
const Author = require('../models/Author');
const path = require('path');

module.exports = {
    getAllAuthors: async function (req, res) {
        try {
            const authors = await Author.findAll();
            if (authors.length === 0) return res.status(404).json({ status: 404, msg: "No authors found." });

            res.status(200).json({ status: 200, result: authors });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching authors', details: error });
        }
    },

    searchAuthors: async function (req, res) {
        const searchQuery = req.query.search;
    
        if (!searchQuery) {
          return res.status(400).json({ msg: 'Search query is required' });
        }
    
        try {
          const authors = await Author.findAll({
            where: {
              name: { [Op.like]: `%${searchQuery}%` }, 
            },
            attributes: ['id', 'name', 'position'], 
          });
    
          if (authors.length === 0) {
            return res.status(404).json({ msg: 'No authors found' });
          }
    
          res.status(200).json({status: 200, result: authors});
        } catch (error) {
          console.error('Error fetching authors:', error);
          res.status(500).json({ msg: 'Internal server error' });
        }
      },

    getAuthorById: async function (req, res) {
        const { id } = req.params;

        try {
            const author = await Author.findOne({ where: { id } });
            if (!author) return res.status(404).json({ status: 404, msg: "Author not found." });

            res.status(200).json({ status: 200, result: author });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching author by ID', details: error });
        }
    },

    createAuthor: async function (req, res) {
        const { name, position, desc } = req.body;

        try {
            let img_author = null;
            if (req.image) {
                const imagePath = path.join(__dirname, '../public/uploads/', req.image.name);
                await req.image.mv(imagePath);
                img_author = `/uploads/${req.image.name}`;
            }

            const author = await Author.create({ name, position, desc, img_author });
            res.status(201).json({ status: 201, msg: "Author created successfully.", result: author });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error creating author', details: error });
        }
    },

    updateAuthor: async function (req, res) {
        const { id } = req.params;
        const { name, position, desc } = req.body;

        try {
            const author = await Author.findOne({ where: { id } });
            if (!author) return res.status(404).json({ status: 404, msg: "Author not found." });

            let img_author = author.img_author;
            if (req.image) {
                const imagePath = path.join(__dirname, '../public/uploads/', req.image.name);
                await req.image.mv(imagePath);
                img_author = `/uploads/${req.image.name}`;
            }

            await author.update({ name, position, desc, img_author });

            res.status(200).json({ status: 200, msg: "Author updated successfully." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error updating author', details: error });
        }
    },

    deleteAuthor: async function (req, res) {
        const { id } = req.params;

        try {
            const author = await Author.findOne({ where: { id } });
            if (!author) return res.status(404).json({ status: 404, msg: "Author not found." });

            await Author.destroy({ where: { id } });

            res.status(200).json({ status: 200, msg: "Author deleted successfully." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error deleting author', details: error });
        }
    },
};
