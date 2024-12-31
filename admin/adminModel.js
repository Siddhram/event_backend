const mongoose=require('mongoose');

const adminSchema=mongoose.Schema({
    adminname:{
         type:String,
    required:true,
    },
    email:{
    type:String,
    required:true,
    unique:true
},
password:{
      type:String,
    required:true,
},
contactNo:{
    type:String,
},
address:{
     type:String,
}

},{timestamps:true});

const adminModel=mongoose.model('admin',adminSchema);
module.exports=adminModel;