const express=require('express');
require('dotenv').config();

const eventModel = require('./eventModel');
const verifyadmintoken = require('../middlewares/verifyadmintoken');
const admineventModel = require('../adminevents/admineventModel');
const verifytoken = require('../middlewares/verifytoken');
const usereventModel = require('../userevents/usereventModel');
const nodemailer = require('nodemailer');

const router=express.Router();
const stripe = require('stripe')(process.env.STRIPE_KEY);
// console.log(process.env.STRIPE_KEY);
router.post('/pay', async (req, res) => {
    try {
        const { eventId, tickets } = req.body;
         const ev=await eventModel.findById(eventId);
         if ((ev&&ev.totalbooking<(ev.alreadybooked+tickets))) {
                        return res.status(404).json({ message: 'sorry that many tickets are not avalable' });
         }
        const event = await eventModel.findByIdAndUpdate(eventId,{ $inc: { alreadybooked: tickets } },{new:true});
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const totalAmount = tickets * event.price * 100;
         // Amount in paise
                         console.log('pay ',event.price);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount,
            currency: 'inr',
        });


        res.status(200).json({
            message: 'Payment initiated',
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/create-event',verifyadmintoken,async (req,res)=>{
    try {
        const {category,eventname,eventplace,images,booklastdate}=req.body;
        if (!category||!eventname||!eventplace||!images||!booklastdate) {
            res.status(403).json({
                message:'send all required data for create-event'
            });
            return;
        }
        const event=new eventModel({...req.body});
        await event.save();
        const adminevent=new admineventModel({adminId:req.adminId,eventscheduled:event._id})
        await adminevent.save();
        const perticularadminevent=await admineventModel.find({
            adminId:req.adminId
        }).populate("eventscheduled");
        res.status(200).json({
            message:'create-event successful',
            thisadminevents:perticularadminevent
        })
    } catch (error) {
       res.status(500).json({
            error:error
        }) 
    }
});


// Configure Nodemailer transporter with Ethereal credentials
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


// Endpoint to send email
// app.post('/sendmail', async (req, res) => {
//   const { to, ticket} = req.body;
//    const ticketCount=ticket
//    const to=email;
//   // Check if the `to` field is provided
//   if (!to) {
//     return res.status(400).json({ error: "Recipient email (to) is required" });
//   }
//   const subject = "Congratulations! Tickets Booked Successfully";
//     const text = `Congratulations! You have successfully booked ${ticketCount} ticket(s). Thank you for booking with us.`;
//     const html = `<h1>Congratulations!</h1><p>You have successfully booked <strong>${ticketCount}</strong> ticket(s).</p><p>Thank you for booking with us!</p>`;

//   try {
//     // Send mail with the transporter
//     const info = await transporter.sendMail({
//       from: '"Maddison Foo Koch 👻" <siddharamsutar23@gmail.com>', // sender address
//       to, // recipient(s)
//       subject: subject || "No Subject", // default subject if none provided
//       text: text || "No text body provided", // default text if none provided
//       html: html || "<b>No HTML body provided</b>", // default html if none provided
//     });

//     // Send response with the email info
//     res.status(200).json({
//       message: "Email sent successfully",
//       messageId: info.messageId,
//       previewUrl: nodemailer.getTestMessageUrl(info) // provides a link to preview the email
//     });
//   } catch (error) {
//     res.status(500).json({
//       error: "Failed to send email",
//       details: error.message,
//     });
//   }
// });
router.post('/book-event-zero',verifytoken,async (req,res)=>{
    try {
        const {eventbooked,ticket,email}=req.body;
        const userId=req.userId;
        const event=await eventModel.findOne({
            _id:eventbooked
        })
        console.log(eventbooked,ticket,email);
        
        if(!event){
          res.status(404).json({
               message:'event not found'
          });
          return;
        }
        // if (ticket<0||ticket>(event.totalbooking-event.alreadybooked)) {
        //       res.status(404).json({
        //        message:'something went wrong '
        //   });
        //   return;
        // }
        // console.log(event.price*ticket);
        //payment
        

        const userevent=new usereventModel({...req.body,userId:userId});
        await userevent.save();
        const alluserevent=await usereventModel.find({});

           const ticketCount=ticket
   const to=email;
  // Check if the `to` field is provided
  if (!to) {
    return res.status(400).json({ error: "Recipient email (to) is required" });
  }
  const subject = "Congratulations! Tickets Booked Successfully";
    const text = `Congratulations! You have successfully booked ${ticketCount} ticket(s). Thank you for booking with us.`;
    const html = `<h1>Congratulations!</h1><p>You have successfully booked <strong>${ticketCount}</strong> ticket(s).</p><p>Thank you for booking with us!</p>`;

    // Send mail with the transporter
    const info = await transporter.sendMail({
      from: '"Maddison Foo Koch 👻" <siddharamsutar23@gmail.com>', // sender address
      to, // recipient(s)
      subject: subject || "No Subject", // default subject if none provided
      text: text || "No text body provided", // default text if none provided
      html: html || "<b>No HTML body provided</b>", // default html if none provided
    });

    // Send response with the email info
    // res.status(200).json({
    //   message: "Email sent successfully",
    //   messageId: info.messageId,
    //   previewUrl: nodemailer.getTestMessageUrl(info) // provides a link to preview the email
    // });
    const eventId=eventbooked;
  const ev=await eventModel.findById(eventId);
         if ((ev&&ev.totalbooking<(ev.alreadybooked+ticket))) {
                        return res.status(404).json({ message: 'sorry that many tickets are not avalable' });
         }
        const even = await eventModel.findByIdAndUpdate(eventId,{ $inc: { alreadybooked: ticket } },{new:true});
        if (!even) {
            return res.status(404).json({ message: 'Event not found' });
        }

  
       res.status(200).json({
          alluserbookedevent:alluserevent,
           message: "Email sent successfully",
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
       })
    } catch (error) {
        res.status(500).json({
            error:error
        })
    }
})



router.post('/book-event',verifytoken,async (req,res)=>{
    try {
        const {eventbooked,ticket,email}=req.body;
        const userId=req.userId;
        const event=await eventModel.findOne({
            _id:eventbooked
        })
        console.log(eventbooked,ticket,email);
        
        if(!event){
          res.status(404).json({
               message:'event not found'
          });
          return;
        }
        if (ticket<0||ticket>(event.totalbooking-event.alreadybooked)) {
              res.status(404).json({
               message:'something went wrong '
          });
          return;
        }
        // console.log(event.price*ticket);
        //payment
        

        const userevent=new usereventModel({...req.body,userId:userId});
        await userevent.save();
        const alluserevent=await usereventModel.find({});

           const ticketCount=ticket
   const to=email;
  // Check if the `to` field is provided
  if (!to) {
    return res.status(400).json({ error: "Recipient email (to) is required" });
  }
  const subject = "Congratulations! Tickets Booked Successfully";
    const text = `Congratulations! You have successfully booked ${ticketCount} ticket(s). Thank you for booking with us.`;
    const html = `<h1>Congratulations!</h1><p>You have successfully booked <strong>${ticketCount}</strong> ticket(s).</p><p>Thank you for booking with us!</p>`;

    // Send mail with the transporter
    const info = await transporter.sendMail({
      from: '"Maddison Foo Koch 👻" <siddharamsutar23@gmail.com>', // sender address
      to, // recipient(s)
      subject: subject || "No Subject", // default subject if none provided
      text: text || "No text body provided", // default text if none provided
      html: html || "<b>No HTML body provided</b>", // default html if none provided
    });

    // Send response with the email info
    // res.status(200).json({
    //   message: "Email sent successfully",
    //   messageId: info.messageId,
    //   previewUrl: nodemailer.getTestMessageUrl(info) // provides a link to preview the email
    // });
  
       res.status(200).json({
          alluserbookedevent:alluserevent,
           message: "Email sent successfully",
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
       })
    } catch (error) {
        res.status(500).json({
            error:error
        })
    }
})

router.get('/getallevents',async (req,res)=>{
    try {
        const allevents=await eventModel.find({});
        res.json({
            message:"all events",
            allevents
        })
    } catch (error) {
        res.status(500).json({
            error:error
        }) 
    }
});
router.get('/user-updated-events',verifytoken,async (req,res)=>{
    try {
        const data=await usereventModel.find({}).populate("eventbooked");
        // console.log(data);
        
        if (data.length>0) {
            const nd= data.filter((each) => each.eventbooked != null);
  res.status(200).json({
            message:"updated booked events",
            updatedevents:nd
        });            
        return;
        }
        res.status(200).json({
            message:"updated booked events",
            updatedevents:data
        });
    } catch (error) {
        res.status(500).json({
            error:error
        }) 
    }
})
router.get('/update-time',verifytoken,async (req,res)=>{
    try {
        const date=new Date().getDate();

        const deletedcount=await eventModel.deleteMany({booklastdate:{$lt:date}});
        //  console.log(deletedcount);
         
        if (deletedcount&&deletedcount.deletedCount>0) {
            const userallev=await usereventModel.deleteMany({
                eventbooked:{
                    $in:await eventModel.findOne({
                        booklastdate:{$lt:date}
                    }).distinct('_id')
                }
            })
            const al=await usereventModel.deleteMany({eventbooked:null}).populate("eventbooked");
        //   const userbookedevents=await usereventModel.find({userId:req.userId}).populate("eventbooked");
        //   console.log("hi ",al);
          
          const allevents=await eventModel.find({});
            
           res.status(200).json({
          
             allevents
           })
            return
        }

        const userbookedevents=await usereventModel.find({userId:req.userId}).populate("eventbooked");

          const allevents=await eventModel.find({});
            
           res.status(200).json({
             userbookedevents,
             allevents
           })
    } catch (error) {
        res.status(500).json({
            error:error
        })
    }
});


router.put('/update-event/:id',async (req,res)=>{
    try {
        const {id}=req.params;
        const singleevent=await eventModel.findByIdAndUpdate(id,{...req.body},{new:true});
        const allevents=await eventModel.find({});
        res.json({
            message:"all events",
            singleevent,
            allevents
        })
    } catch (error) {
        res.status(500).json({
            error:error
        }) 
    }
});
router.delete('/delete-event/:id',async (req,res)=>{
    try {
        const {id}=req.params;
        const data=await eventModel.findByIdAndDelete(id);
        const allevents=await eventModel.find({});
         res.json({
            message:"all events",
            allevents
        })
    } catch (error) {
        res.status(500).json({
            error:error
        }) 
    }
})

module.exports=router;