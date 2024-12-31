const jwt=require('jsonwebtoken');
const verifytoken=async (req,res,next)=>{
try {
    const token=req.cookies.token;
    // console.log(
    //     'tok' ,token
    // );
    
     if (!token) {
        res.status(402).json({
            message:'auth token error'
        })
        return;
    }
    const decode= jwt.verify(token,process.env.JWT);
    if (!decode) {
        res.status(402).json({
            message:'auth token error'
        })
        return;
    }
    req.userId=decode._id;
    next();
    
} catch (error) {
  res.status(400).json({
            error
        })
        return;
    }
}
module.exports=verifytoken;