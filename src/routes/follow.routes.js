import express from "express";
import { follow, getUSerfollow, getUSerfollowers } from "../controller/follow.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";
 const FollowRouter= express.Router()

 FollowRouter.put('/follow',verifyJWT,follow)
 FollowRouter.get('/getUserFollow',verifyJWT,getUSerfollow)
 FollowRouter.get('/getUserFollowers',verifyJWT,getUSerfollowers)
 
 export default  FollowRouter