import mongoose from "mongoose";
import Like from "./like.model.js"; // Assuming your like model is in a file named like.model.js

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    image: [
        {
            type: String,
            required: false,
        }
    ],
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    like: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'like'
    }
}, { timestamps: true });
// Populate the 'like' field by default whenever fetching a post
postSchema.set('string', { 
    transform: (doc, ret) => {
        ret.like = Like.findById(ret.like).count();
        return ret;
    }
});
const Post = mongoose.model("Post", postSchema);

export default Post;
