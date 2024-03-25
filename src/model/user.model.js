import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt"
import  Jwt  from "jsonwebtoken";
const userSchema = mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    refreshToken:{
        type:String
    },
    profilepic:{
        type:String,
        required:true,
    },
  
},{timestamps:true})


userSchema.methods.isPasswordCorrect =async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
    return Jwt.sign({
        _id:this._id,
      
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return Jwt.sign({
        _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
    )
}
const user= new mongoose.model("user",userSchema);

export default user;