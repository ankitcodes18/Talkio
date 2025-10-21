const express = require('express');
const userModel = require('../models/user-model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const router = express.Router();
require('dotenv').config();
const secret_key = process.env.SECRET_KEY || c.get("secret_key");
router.post('/' , async(req , res)=>{
    res.clearCookie("token");
    try{
        let {username , password} = req.body;
        const existinguser = await userModel.findOne({username});
         if(!existinguser){
            res.status(400).send("something went wrong");
            return;
        }

        bcrypt.compare(password , existinguser.password , function(err , result){
        if(result){
            let token = jwt.sign({username}, secret_key);
            
            res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            });
            res.send(existinguser)
        }
        else{
            res.send("something went wrong")
        }
        })
    }
    catch(err){
        res.send(err);
    }
            
})

module.exports = router