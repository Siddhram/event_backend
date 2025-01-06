const express=require('express');
const jwt=require('jsonwebtoken');
const cookie_parser=require('cookie-parser');
const bcrypt=require('bcrypt');
const adminModel = require('./adminModel');
const generateadminToken = require('../middlewares/generateadmintoken');
const router=express.Router();

router.post('/resister',async (req,res)=>{
    try {
        const {adminname,email,password}=req.body;
        if (!adminname||!email||!password) {
            res.status(401).json({
                message:"send all required data"
            })
            return;
        }
        const admin=new adminModel({...req.body});
        const hashedpass=await bcrypt.hash(password,10);
        admin.password=hashedpass;
        await admin.save();
        res.status(200).json({
            message:'admin resistered succsessfull'
        });
    } catch (error) {
         res.status(500).json({
            error:error
        })
    }
});

router.post('/login',async (req,res)=>{
    try {
        const {email,password}=req.body;
        if (!email||!password) {
             res.status(401).json({
                message:"send all required data"
            })
            return;
        }
        const adminuser=await adminModel.findOne({
            email
        });
        if (!adminModel) {
             res.status(401).json({
                message:"email or passwoord wrong"
            })
            return;
        }
        const veripass=await bcrypt.compare(password,adminuser.password);
        if (!veripass) {
             res.status(401).json({
                message:"email or passwoord wrong"
            })
            return;
        }
        const token=await generateadminToken({_id:adminuser._id});
        console.log(token);
        
    //     res.cookie('admintoken',token,{
    //           httpOnly: true,   // Makes the cookie accessible only via HTTP requests
    // secure: true,     // Ensures cookie is sent over HTTPS
    // sameSite: 'None', // Allows cross-site cookies
    //     })
        res.status(200).json({
            admintoken:token,
            message:"admin login succsessfull",
            adminuser
        })
    } catch (error) {
        res.status(500).json({
            error:error
        })
    }
});

module.exports=router;