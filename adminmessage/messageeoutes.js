const express=require('express');
const nodemailer=require('nodemailer');
const issueModel = require('./adminmessageModel');
const router=express.Router();

router.post('/',async (req,res)=>{
    try {
      
        const data=new issueModel({...req.body});
        await data.save();
        res.status(200).json({
            message:"Your message is send"
        })
    } catch (error) {
        res.status(500).json({
            error
        })
    }
});

router.get("/getallissues",async (req,res)=>{
    try {
        const data=await issueModel.find({});
        res.status(200).json({
            data:data
        })
    } catch (error) {
        res.status(500).json({
            error
        })
    }
})
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Corrected to Gmail SMTP server
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "siddharamsutar23@gmail.com",
    pass: "hdwg fbvj cxpo atkn", // Be sure to use an app password here for Gmail
  },
  tls: {
    rejectUnauthorized: false,  // Allow self-signed certificates
  },
});
router.post('/delete/:id',async (req,res)=>{
    try {
        const {id}=req.params;
        const {useremail,subject,message}=req.body;    
        const to=useremail; 
const html = `
  <p>Hi,</p>
  <p>We have received your issue regarding <strong>${subject}</strong>.</p>
  <p>Your message:</p>
  <blockquote style="border-left: 4px solid #ccc; padding-left: 10px; color: #555;">
    ${message}
  </blockquote>
  <p>Our support team is currently reviewing your concern and will get back to you shortly.</p>
  <p>Thank you for reaching out!</p>
  <p>Best regards,<br/>Event Booking Team</p>
`;
const info = await transporter.sendMail({
  from: '"Event Booking Admin 👻" <siddharamsutar23@gmail.com>',
  to,
  subject: `Issue Received: ${subject}`,
  html,
});
       const d=await issueModel.findByIdAndDelete(id);
       console.log(d);
       res.status(200).json({
         message:"deleted issue"
       }) 
    } catch (error) {
        res.status(500).json({
            error
        })
    }
})

module.exports=router;