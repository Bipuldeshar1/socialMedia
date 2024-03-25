
import Follow from "../model/follow.model.js"

const follow=async(req,res)=>{
try {
    const{followeeId}=req.body;
   const followerId= req.user._id;
    const existingFollow= await Follow.findOne({follower:followerId,followee:followeeId});
if(followeeId == followerId){
    return res.status(200).json({msg:'cant follow urself'})
}
if(existingFollow){
    const removeFollow=   await Follow.findByIdAndDelete(existingFollow._id);
       return res.status(200).json({msg:'unfollow success'})
   }
  else{
   const follow= await Follow.create({follower:followerId,followee:followeeId});
   return res.status(200).json({msg:'follow success'})
  }


} catch (error) {
    console.log(error)
}
}




const getUSerfollow=async(req, res)=>{
    try {
       const userfollow= await Follow.find({follower:req.user._id});

       if(!userfollow[0]){
        return res.status(200).json({msg:'follow first'})
       }
       return res.status(200).json({userfollow,msg:'success'})
    } catch (error) {
        console.log(error)
    }

}

const getUSerfollowers = async (req, res) => {
    try {
        // Find followers of the user
        const userFollowers = await Follow.find({ followee: req.user._id })
                                            .populate('follower');

        // Check if there are followers
        if (!userFollowers || userFollowers.length === 0) {
            return res.status(200).json({ followers: [], msg: 'No followers' });
        }

        // Return followers
        return res.status(200).json({ followers: userFollowers, msg: 'Success' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
}

export {follow,getUSerfollow,getUSerfollowers}