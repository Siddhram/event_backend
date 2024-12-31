const jwt=require('jsonwebtoken');
const generateToken= ({_id})=>{
  const token= jwt.sign({_id},process.env.JWT);
  return token;
}
module.exports=generateToken;