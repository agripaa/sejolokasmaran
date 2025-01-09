const path = require('path');

const uploadImage = (req, res, next) => {
    if (!req.files || !req.files.image) {
        return res.status(400).json({ status: 400, msg: "Image file is required." });
    }

    const image = req.files.image;

    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    const fileExtension = path.extname(image.name).toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
        return res.status(400).json({ status: 400, msg: "Invalid file type. Only JPG, JPEG, and PNG are allowed." });
    }

    if (image.size > 10 * 1024 * 1024) {
        return res.status(400).json({ status: 400, msg: "File size must be less than 10MB." });
    }

    req.image = image;
    next();
};

module.exports = uploadImage;
