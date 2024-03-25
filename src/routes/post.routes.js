import express from 'express'
import verifyJWT from '../middleware/auth.middleware.js';
import { addPost, deletePost,  getAllPost,  getSinglePost,  getUserPost, getfollowPost, updatePost } from '../controller/post.controller.js';
import { upload } from '../middleware/multer.middleware.js';

const postRouter=express.Router();

postRouter.post("/add-post",upload.fields([{
name:'image',

}]),verifyJWT,addPost)

postRouter.get('/getUserPost',verifyJWT,getUserPost)
postRouter.get('/getAllPost',getAllPost)
postRouter.get('/getSinglePost/:id',getSinglePost)
postRouter.get('/getFollowPost',verifyJWT,getfollowPost)

postRouter.patch('/update/:id',upload.fields([{
    name:'image',
}]),verifyJWT,updatePost)

postRouter.delete('/delete/:id',verifyJWT,deletePost)

export default postRouter;
