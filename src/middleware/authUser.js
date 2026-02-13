const jwt = require('jsonwebtoken');

const authMiddleware = (req,res,next)=>{
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({
            status_code:401,
            message:"Unauthorized, no token provided"
        })
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user = decoded
        next()
        
    } catch (error) {
        console.error(error.message)
        res.status(401).json({
            status_code:401,
            message:"Unauthorized, invalid token"
        })
    }
        
}

module.exports = authMiddleware;