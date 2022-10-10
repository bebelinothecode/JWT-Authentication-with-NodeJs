require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports  = async(req,res,next) => {
    const token = req.header('x-auth-token');

    if(!token) {
        return res.status(401).json({
            msg:"No token found"
        });
    }
    try {
       let user = await jwt.verify(token,process.env.SECRET);
       req.user = user.email;
       next();
    } catch (error) {
        return res.status(400).json({
            msg:`Ivalid Token`,
        });
    }
} 