import express, { json } from "express"
import userRouter from "./src/routes/user.routes.js";
import cookieParser from "cookie-parser";
import connect from "./src/db/connect.js";
import dotenv from "dotenv"
import cors from "cors"
import postRouter from "./src/routes/post.routes.js";
import Likerouter from "./src/routes/like.routes.js";
import FollowRouter from "./src/routes/follow.routes.js";
const app=express();

const PORT=8000;

dotenv.config();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));
  
// app.use(cors());

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}))


app.use('/user',userRouter);
app.use('/post',postRouter);
app.use('/post/like',Likerouter);
app.use('/user/',FollowRouter);

connect().then(
    app.listen(PORT,()=>console.log(`server runnning at port ${PORT}`))
    ).catch((err)=>{
        console.log(`mongo db conn fail`,err)
    })


app.get("/",(req,res)=>{
    res.send('h')
})