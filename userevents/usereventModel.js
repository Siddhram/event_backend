const mongoose=require('mongoose');
const usereventSchema=mongoose.Schema({
   userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user'
   },
   eventbooked:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'event'
   },
   ticket:{
    type:Number,
    default:0 
   }
},{timestamps:true});

const usereventModel=mongoose.model('userevent',usereventSchema);
module.exports=usereventModel;