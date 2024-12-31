const mongoose=require('mongoose');
const admineventSchema=mongoose.Schema({
   adminId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'admin'
   },
   eventscheduled:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'event'
   }
},{timestamps:true});

const admineventModel=mongoose.model('adminevent',admineventSchema);
module.exports=admineventModel;