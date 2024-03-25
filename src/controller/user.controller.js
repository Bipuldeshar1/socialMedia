import { uploadOnCloudinary } from "../cloudinary/cloudinary.js";
import User from "../model/user.model.js"
import bcrypt from "bcrypt"


const generateAccessAndRefreshToken=async(userId)=>{
    
    try {
      
        const user=await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const accessToken=user.generateAccessToken();
        const refreshToken=user.generateRefreshToken();

        user.refreshToken=refreshToken;
    //    await user.save({validateBeforeSave:false})
        return {accessToken,refreshToken}
    } catch (error) {
        console.log("sth went wrong while generating refresha nd access token",error);
    }
}

const registerUser = async (req, res) => {
    const { fullName, email, password } = req.body;
    
    try {
        if (!fullName || !email || !password) {
            throw new Error('Incorrect registration details');
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.json({ msg: 'Email is already in use' });
        }

        const profileImageLocalPath=req.files?.profilepic[0]?.path;

        if(!profileImageLocalPath){
            throw new Error('profile pic needed');
        }

        const profilepic=await uploadOnCloudinary(profileImageLocalPath);

        if(!profilepic){
            throw new Error('profile pic needed after ');
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const regUser = await User.create({ fullName, email, password:hashedPassword,profilepic:profilepic.url });
   
        return res.json({ msg: 'User registered successfully', regUser});
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const loginUser=async(req,res)=>{
   try {
    const{email,password}=req.body;

   if(!email ||!password){
    throw new Error('empty login details');
   }

   const user=await User.findOne({email});

   if(!user){
    return res.status(400).json({error:'user not found'})
   }
const isPasswordvalid=await user.isPasswordCorrect(password);
if(!isPasswordvalid){
   return res.status(400).json({msg:'invalid password'})
}
const {accessToken, refreshToken}= await generateAccessAndRefreshToken(user._id);
const loggedInUser = await User.findById(user._id).select(" -password -refreshToken");


return res.status(200).cookie('accessToken',accessToken).cookie('refreshToken',refreshToken).json({loggedInUser,accessToken,refreshToken,msg:'login success'})
   } catch (error) {
    console.log(error)
 
   }



}

const logout=async(req,res)=>{
 const user=await User.findByIdAndUpdate(req.user._id,{
    $unset:{
        refreshToken:1
    },
  
 },
 {
    new:true
 }
 )
 return res.status(200).clearCookie("accessToken").clearCookie("refreshToken").json({user},"user loggout success")
}

const getCurrentUser=async(req,res)=>{
    const user=await User.findById(req.user._id);
    if(!user){
        throw new Error("unable to fetch user")  
    }
    return res.status(200).json({user:user,msg:'success'})
}

export {registerUser,loginUser,logout,getCurrentUser}