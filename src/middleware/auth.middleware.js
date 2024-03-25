import User from "../model/user.model.js"
import  Jwt  from "jsonwebtoken"
const verifyJWT=async(req, res ,next) =>{
    try {
        const token=req.cookies?.accessToken ||  req.header("Authorization")?.replace("Bearer", "").trim()
        if(!token){
            throw new Error('unauthorized requests')
        }
        const decodedToken= Jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        
        const user=await User.findById(decodedToken?._id).select("-password -refreshToken")
        if(!user){
            throw new Error("Invalid acceess token user")
        }
        req.user=user
        next()
    } catch (error) {
        if(error.name === "TokenExpiredError"){
            try {
                console.log('access token expired refreshing....');
                const refreshToken = req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer", "").trim();
    
                if (!refreshToken) {
                  throw new Error("No refresh token provided");
                }
                const decodedRefreshToken = Jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                if (!decodedRefreshToken) {
                    throw new Error( "Invalid refresh token");
                  }
                  const user = await User.findById(decodedRefreshToken?._id).select("-password -refreshToken");
    
                  if (!user) {
                    throw new Error("Invalid refresh token user");
                  }
                   // Generate a new access token
            const newAccessToken =Jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, );
    
            // Set the new access token in the response header or cookie
            res.cookie("accessToken", newAccessToken, { httpOnly: true });
    
            // Update req.user with the refreshed user
            req.user = user;
    
            // Continue to the next middleware
            next();
          } catch (refreshError) {
            console.log(`Error refreshing token: ${refreshError}`);
            throw new Error( "Error refreshing token");
          }
                  
            
             
         }
         else {
            console.log(`My error: ${error}`);
            throw new Error( error?.message);
          }
        }
    }


export default verifyJWT;