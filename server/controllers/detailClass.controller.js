const DetailClass = require('../models/DetailClass');
const ListClass = require('../models/ListClass');
const Subject = require('../models/Subject');
const path = require('path');

module.exports = {
    getAllDetailClasses: async function (req, res) {
        try {
          const detailClasses = await DetailClass.findAll({
            include: [
              { model: ListClass, attributes: ['title'] },
              { model: Subject, attributes: ['sub_lear_path'] }, 
            ],
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

      getDetailClassById: async function (req, res) {
        const { id } = req.params;
        
        try {
          const detailClasses = await DetailClass.findOne({
            include: [
              { model: ListClass, attributes: ['title'] },
              { model: Subject, attributes: ['sub_lear_path'] }, 
            ],
            where: { list_class_id: id }
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
      
        if (!list_class_id || !desc || !req.files || !req.files.content) {
          return res.status(400).json({ status: 400, msg: "All fields and files are required." });
        }
      
        const files = Array.isArray(req.files.content) ? req.files.content : [req.files.content];
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.mp4', '.pdf'];
        const uploadedFiles = [];
      
        try {
          const detailClass = await DetailClass.create({ list_class_id, desc });
      
          for (const file of files) {
            const fileExtension = path.extname(file.name).toLowerCase();
            if (!allowedExtensions.includes(fileExtension)) {
              return res.status(400).json({ status: 400, msg: `Invalid file type: ${file.name}.` });
            }
      
            const uploadPath = path.join(__dirname, '../public/uploads/', file.name);
      
            await new Promise((resolve, reject) => {
              file.mv(uploadPath, (err) => {
                if (err) reject(err);
                resolve();
              });
            });
      
            const subject = await Subject.create({
              detail_class_id: detailClass.id,
              sub_lear_path: `/uploads/${file.name}`,
            });
      
            uploadedFiles.push(subject);
          }
      
          res.status(201).json({
            status: 201,
            msg: "Detail class and content created successfully.",
            result: { detailClass, subjects: uploadedFiles },
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
            const detailClass = await DetailClass.findOne({
                where: { id },
                include: [{ model: Subject }],
            });
    
            if (!detailClass) {
                return res.status(404).json({ status: 404, msg: "Detail class not found." });
            }
    
            // Update detail class fields
            await DetailClass.update({ list_class_id, desc }, { where: { id } });
    
            // Handle file updates
            if (req.files && req.files.content) {
                const files = Array.isArray(req.files.content) ? req.files.content : [req.files.content];
                const allowedExtensions = ['.jpg', '.jpeg', '.png', '.mp4', '.pdf'];
                const uploadedFiles = [];
    
                for (const file of files) {
                    const fileExtension = path.extname(file.name).toLowerCase();
                    if (!allowedExtensions.includes(fileExtension)) {
                        return res.status(400).json({ status: 400, msg: `Invalid file type: ${file.name}.` });
                    }
    
                    const uploadPath = path.join(__dirname, '../public/uploads/', file.name);
    
                    await new Promise((resolve, reject) => {
                        file.mv(uploadPath, (err) => {
                            if (err) reject(err);
                            resolve();
                        });
                    });
    
                    const subject = await Subject.create({
                        detail_class_id: detailClass.id,
                        sub_lear_path: `/uploads/${file.name}`,
                    });
    
                    uploadedFiles.push(subject);
                }
            }
    
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
