const express = require('express');
const router = express.Router();
const upload = require('../Middlewares/multerMiddleware');
const uploadOnCloudinary = require('../utils/cloudinary');
const chatModel = require('../models/message-model');

router.post('/:from/:to', upload.single('image'), async (req, res) => {
    try {
        const { from, to } = req.params;
        const { text } = req.body;
        const file = req.file;

        let mediaUrl = '';

        if (file) {
            const response = await uploadOnCloudinary(file.path);
            if (!response) {
                return res.status(500).json({ message: "Error in image sending" });
            }
            mediaUrl = response.secure_url;
        }

        const chat = await chatModel.create({
            from,
            to,
            text,
            media: mediaUrl
        });

        return res.status(201).json(chat);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error in message sending" });
    }
});

module.exports = router;
