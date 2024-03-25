import { uploadOnCloudinary } from "../cloudinary/cloudinary.js";
import Post from "../model/post.model.js";
import Follow from "../model/follow.model.js";

const addPost = async (req, res) => {
    const { content,title } = req.body;
    let images = [];

    if (!content || !title) {
        throw new Error('No post content');
    }

   
    if (req.files && req.files.image && req.files.image.length > 0) {
       for( let i=0;i<req.files.image.length;i++){
        const postImageLocalPath = req.files.image[i].path;
             
      const  uploadedImage = await uploadOnCloudinary(postImageLocalPath);
    
      images.push(uploadedImage.url);
       }
     
    }

    const post = await Post.create({ title,content, image:images, postedBy: req.user._id });

    return res.status(200).json({ post, msg: 'Success' });
};

const getAllPost = async (req, res) => {
    try {
        const posts = await Post.aggregate([
            {
                $lookup: {
                    from: "likes", // Assuming your collection name for likes is "likes"
                    localField: "_id",
                    foreignField: "likedPost",
                    as: "likes"
                }
            },
            {
                $project: {
                    title: 1,
                    content: 1,
                    image: 1,
                    postedBy: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    __v: 1,
                    likeCount: { $size: "$likes" } // Count the number of likes
                }
            }
        ]);

        if (!posts || posts.length === 0) {
            return res.status(200).json({ msg: 'No posts found' });
        }

        return res.status(200).json({ posts, msg: 'Success' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};


const getUserPost = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming userId is passed in the request parameters

        const posts = await Post.aggregate([
            {
                $match: { postedBy: userId} // Filter posts by userId
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "likedPost",
                    as: "likes"
                }
            },
            {
                $project: {
                    title: 2,
                    content: 1,
                    image: 1,
                    postedBy: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    __v: 1,
                    likeCount: { $size: "$likes" }
                }
            }
        ]);

        if (!posts || posts.length === 0) {
            return res.status(200).json({ msg: 'No posts found' });
        }

        return res.status(200).json({ posts, msg: 'Success' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};


const updatePost = async (req, res) => {
    let { content,title } = req.body;
    let images = [];
    let post = await Post.findById(req.params.id);

    if (!post) {
        return res.status(404).json({ msg: 'No post found' });
    }
    if (content === undefined) {
        content = post.content;
    }

    if (title === undefined) {
        title = post.title;
    }
  
    images = post.image;
    if (req.files && req.files.image && req.files.image.length > 0) {
        for (let i = 0; i < req.files.image.length; i++) {
            const postImageLocalPath = req.files.image[i].path;
            const uploadedImage = await uploadOnCloudinary(postImageLocalPath);
            images.push(uploadedImage.url);
        }
    } 
   
    if (req.user._id.toString() !== post.postedBy.toString()) {
        return res.status(403).json({ msg: 'User does not have permission to update post' });
    }

    const updatePost = await Post.findByIdAndUpdate(req.params.id, { content, title,image:images }, { new: true });
    const updatedPost= await Post.findById({_id:updatePost._id});
    return res.status(200).json({ updatedPost, msg: 'Success' });
};

const deletePost=async(req, res)=>{
    const post= await Post.findById(req.params.id)
    console.log(post)
    if(!post){
        return res.status(400).json({msg:'no post found'})
    }
    if(req.user._id.toString() !== post.postedBy.toString()){
   return res.json({msg:'user dont have privelage to update post'})
    }

    const deletedpost= await Post.findOneAndDelete(post._id)

    return res.status(200).json({deletedpost,msg:'success'});
}
const getSinglePost =async(req,res)=>{
    const post=await Post.find({_id:req.params.id});
    return res.status(200).json({post,msg:'success'})

}

const getfollowPost= async (req, res) => {
    try {
      const  userId  = req.user._id; 
  console.log(userId)
      // Find users whom the authenticated user follows
      const followedUsers = await Follow.find({ follower: userId });

      // Extract followee IDs
      const followeeIds = followedUsers.map(follow => follow.followee);
  
      // Find posts created by the followed users
      const posts = await Post.find({ postedBy: { $in: followeeIds } }).populate('postedBy');
  if(!posts[0]){
   return res.json({msg:'first follow someone'})
  }
      res.json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

export {addPost,getUserPost,updatePost,deletePost,getAllPost,getSinglePost,getfollowPost}