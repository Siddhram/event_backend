const jwt=require('jsonwebtoken');
const generateadminToken=async ({_id})=>{
  const token= jwt.sign({_id},process.env.JWT);
  return token;
}
module.exports=generateadminToken;