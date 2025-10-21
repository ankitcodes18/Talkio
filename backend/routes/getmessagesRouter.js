const express = require('express');
const chatModel = require('../models/message-model');
const router = express.Router();

router.get('/:from/:to' , async(req , res)=>{
    const {from , to} = req.params;

    try {
    
    const messages = await chatModel.find({
      $or: [
        { from: from, to: to },
        { from: to, to: from }
      ]
    }).sort({ createdAt: 1 }); 

    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
})

module.exports = router;