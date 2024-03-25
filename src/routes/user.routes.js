import { Router  } from "express";
import { getCurrentUser, loginUser, logout, registerUser } from "../controller/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import verifyJWT from "../middleware/auth.middleware.js";


const userRouter=Router();

userRouter.post("/register",upload.fields([
    {
        name:'profilepic',
        maxCount:1
    }
]),registerUser)

userRouter.post("/login",loginUser)

userRouter.post('/log-out',verifyJWT,logout)
userRouter.get('/currentUser',verifyJWT,getCurrentUser)

export default userRouter