const express = require('express');
const userModel = require('../models/user-model')
const bcrypt = require('bcrypt');
const cors = require('cors');

const jwt = require('jsonwebtoken')
const router = express.Router();
require('dotenv').config();
const secret_key = process.env.SECRET_KEY || c.get("secret_key");
router.post('/' , async(req , res)=>{
    try{
        let {username , password} = req.body;
        const isexistinguser = await userModel.findOne({username});
        if(isexistinguser){
            res.status(400).send("Username ALready Taken");
            return;
        }
        
        bcrypt.genSalt(10 , (err,salt)=>{
            bcrypt.hash(password , salt , async(err , hash)=>{
                if(err)return res.send(err.message);
                else {
                    try{
                        let user = await userModel.create({
                        username , password:hash
                    })
                    let token = jwt.sign({username} , secret_key)
                    res.clearCookie("token");
                    res.cookie('token', token, {
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true,
                    });
                    res.status(200).send(user)
                    }
                    catch(err){
                        res.send(err);
                    }
                }
            })
        })
    }
    catch(err){
        res.send(err);
    }


})

module.exports =  router;