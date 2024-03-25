import express from "express"
import verifyJWT from "../middleware/auth.middleware.js";
import { addRemoveLike } from "../controller/like.controller.js";

const Likerouter=express.Router();

Likerouter.put("/addRemoveLike/:id",verifyJWT,addRemoveLike)

export default Likerouter
