const jwt=require('jsonwebtoken');
const cookie_parser=require('cookie-parser');
const verifyadmintoken=async (req,res,next)=>{
    try {

        const admintok=req.cookies.admintoken;
        
        if (!admintok) {
            res.status(402).json({
                message:"admintoken not found"
            });
            return;
        }
        const decode=jwt.verify(admintok,process.env.JWT)
        if (!decode) {
            res.status(402).json({
                message:"admintoken not found"
            });
            return;
        }
        req.adminId=decode._id
        next();
    } catch (error) {
        res.status(400).json({
            message:"error admintoken key not exist"
        })
        return;
    }
}
module.exports=verifyadmintoken;