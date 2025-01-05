const express=require('express');
const userModel = require('./userModel');
const jwt=require('jsonwebtoken');
const cookie_parser=require('cookie-parser');
const generateToken = require('../middlewares/generateToken');
const bcrypt=require('bcrypt');
const verifytoken = require('../middlewares/verifytoken');
const usereventModel = require('../userevents/usereventModel');
const router=express.Router();

router.post('/resister',async (req,res)=>{
    try {
        const {username,email,password}=req.body;
        if(!username||!email||!password){
            res.status(401).json({
                message:"send all required data"
            })
            return;
        }
        const user=new userModel({...req.body});
        await user.save();

        res.status(200).json({
            message:"user resistered succsessfull",
        })
    } catch (error) {
        res.status(500).json({
            error:error
        })
    }
});

router.post('/login',async (req,res)=>{
    try {
        const {email,password}=req.body;

        if(!email||!password){
            res.status(401).json({
                message:"send all required data"
            })
            return;
        }
        const user=await userModel.findOne({email});
        if (!user) {
             res.status(401).json({
                message:"email or passwoord wrong"
            })
            return;
        }
        const verpass=await bcrypt.compare(password,user.password);
          if (!verpass) {
             res.status(401).json({
                message:"email or passwoord wrong"
            })
            return;
        }
        
        
        const token=generateToken({_id:user._id});
        res.cookie('token',token,{
              httpOnly: true,   // Makes the cookie accessible only via HTTP requests
    secure: true,     // Ensures cookie is sent over HTTPS
    sameSite: 'None', // Allows cross-site cookies
        });
        res.status(200).json({
            message:"login user succsessfull",
            user
        })
        
    } catch (error) {
         res.status(500).json({
            error:error
        })
    }
});

router.post('/update',verifytoken,async (req,res)=>{
    try {
        const id=req.userId;
        const userdata=await userModel.findByIdAndUpdate(id,{...req.body},{new:true});
        console.log(req.body);
        
        res.status(200).json({
            user:userdata,
            message:"profile updated"
        })
    } catch (error) {
        res.status(500).json({
            error:error
        })
    }
})

router.get('/currentusers',async (req,res)=>{
    try {
        const data=await userModel.find({});
        res.status(200).json({
            current:data
        })
    } catch (error) {
        res.status(500).json({
            error:error
        })
    }
})
module.exports=router;