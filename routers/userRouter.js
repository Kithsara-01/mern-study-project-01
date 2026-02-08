import express from "express" 
import { createUser, loginUser } from "../controllers/userController.js"

const userRouter = express.Router();  // express ta kiynawa routr ekak hadala kiyala
userRouter.post("/", createUser)  // mekata post req ekak awoth create function ekak hdanna.
userRouter.post("/login" ,loginUser);

export default userRouter;