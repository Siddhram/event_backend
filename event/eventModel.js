const mongoose=require('mongoose');
const eventSchema=mongoose.Schema({
  
  category:{
     type:String,
    required:true,
  },
  eventname:{
       type:String,
    required:true,
  },
  eventplace:{
      type:String,
    required:true,
  },
  images:{
   type:[String],
   required:true
  },
  price:{
    type:Number,
    default:0
  },
  foodmanagement:{
    type:String,
    default:"Not included"
  },
  totalbooking:{
    type:Number,
    default:0
  },
  alreadybooked:{
    type:Number,
    default:0
  },
  booklastdate:{
    type:Number,
    required:true
  }
},{timestamps:true});

const eventModel=mongoose.model('event',eventSchema);
module.exports=eventModel;