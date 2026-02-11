import express from "express" 
import mongoose from "mongoose" 

import dns from "node:dns"
dns.setServers(["1.1.1.1", "8.8.8.8"])

import bodyParser from "body-parser" 
import userRouter from "./routers/userRouter.js"
import jwt from "jsonwebtoken"
import { decode } from "node:querystring"
import productRouter from "./routers/productRouter.js"
import dotenv from "dotenv" 
dotenv.config()



const app = express()

app.use(bodyParser.json()) 

app.use(
    (req, res, next)=>{
        const value = req.header("Authorization")
        if(value != null){
            const token = value.replace("Bearer " , "") // mathaka athuwa "Bearer<space>" , "<no space>"
            jwt.verify(   // token eka decrypt/decode kirima
                token,
                process.env.JWT_SECRET,
                (err, decoded)=>{
                    if(decoded == null){
                        res.status(403).json({
                            message : "Unauthorized"
                        })
                    }else{  // token eka correct nam thamyi else ekata ewanne
                        req.user = decoded  // decode karapu data tika req ekata user kiyla varyable ekain dala ilaga thanata yawima
                        next()
                    }
                }
            )
        }else{
            next()   // meya midle were ekakne, token eka hri nm methnain ehata login ekaa adala thanakata yawanawa
        }
        
    }
)


const connectionString = process.env.MONGO_URI 

mongoose.connect(connectionString).then(
    ()=>{
        console.log("Connected to database")
    }
).catch(
    ()=>{
        console.log("Faild to connect with database !")
    }
)


app.use("/api/users" , userRouter)
app.use("/api/products" , productRouter)


app.listen(3000, ()=>{
    console.log("Server is run on port 3000")
});

