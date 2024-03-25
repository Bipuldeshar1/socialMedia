import mongoose,{Schema} from "mongoose";

const likeSchema= new mongoose.Schema({
    likedPost:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'post',
    },
    likedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
},{timestamps:true})

const like=new mongoose.model('like',likeSchema);

export default like;