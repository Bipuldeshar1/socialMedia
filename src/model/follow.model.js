import mongoose,{Schema} from "mongoose";

const followSchema= mongoose.Schema({
    follower:{   //"follower" typically refers to the user who is doing the following,
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    followee:{ //followee" refers to the user who is being followed
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
})

const Follow= mongoose.model('Follow', followSchema);

export default Follow;