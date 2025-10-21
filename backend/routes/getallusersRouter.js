const express = require('express');
const userModel = require('../models/user-model')

const router = express.Router();

router.get('/' , async(req , res)=>{
    try{
        const data = await userModel.find({} , { _id:0 , username :1 , status:1});
        res.send(data);
    }
    catch(err){
        res.send(err);
    }
})

module.exports = router;