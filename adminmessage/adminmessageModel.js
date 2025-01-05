const mongoose=require('mongoose');
const issueScheme=mongoose.Schema({
 useremail:{
     type:String,
     required:true
},
subject:{
     type:String,
},
message:{
     type:String,
}
},{timestamps:true});


const issueModel=mongoose.model('issues',issueScheme);
module.exports=issueModel;