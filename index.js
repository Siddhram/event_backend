const express=require('express');
const dotenv=require('dotenv');
const mongoose=require('mongoose');
const userRouter=require('./user/userRoutes');
const adminRouter=require('./admin/adminRoute');
const eventRouter=require('./event/eventRoute');
const messageRouter=require('./adminmessage/messageeoutes');
const cookieparser=require('cookie-parser');
const cors=require('cors');
const app=express();
dotenv.config();

mongoose.connect(process.env.MONGOURL).then(()=>{
console.log('mongodb connected');
}).catch(()=>{
console.log('mongodb disconnected');
})
//middleware
app.use(cors(
    {
    origin:  ['http://localhost:5173', 'https://eventbook-ten.vercel.app','https://event-frontend-1.onrender.com'], // Frontend URL
    credentials: true, // Allow cookies to be sent
}
))
app.use(cookieparser());
app.use(express.json());

app.use('/user',userRouter);
app.use('/admin',adminRouter);
app.use('/event',eventRouter);
app.use('/message',messageRouter);

//routes
app.listen(process.env.PORT,()=>{
    console.log('server on');
})