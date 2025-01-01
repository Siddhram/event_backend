const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const userSchema=mongoose.Schema({
username:{
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
dis:{
          type:String,
default:''
  }
},{timestamps:true});

userSchema.pre('save',async function(next){
    try {
        if(this.isModified('password')){
        const hashpass=await bcrypt.hash(this.password,10);
        this.password=hashpass;
        }

        next()
    } catch (error) {
        console.log(error);
        
    }
})

const userModel=mongoose.model('user',userSchema);
module.exports=userModel;