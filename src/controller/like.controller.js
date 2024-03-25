import Like from "../model/like.model.js";
import Post from "../model/post.model.js";

const addRemoveLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const like = await Like.findOne({ likedPost: post._id, likedBy: req.user._id });

        if (like) {      
            await Like.findByIdAndDelete(like._id);
            return res.status(200).json({ message: 'Like removed successfully' });
        } else { 
            const newLike = await Like.create({ likedPost: req.params.id, likedBy: req.user._id });
            return res.status(200).json({ message: 'Like added successfully', like: newLike });
        }
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export { addRemoveLike };
