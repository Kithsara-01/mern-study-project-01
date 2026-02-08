import User from "../models/user.js"
import bcrypt from "bcrypt" 
import jwt from "jsonwebtoken"


export function createUser(req, res){   // post request

    const passwordHash = bcrypt.hashSync(req.body.password, 10);  // password eka hash kirima/hide kirima , req eke body eken ena password kiyana ekta hash karala thiyenne

    const userData = {

        firstName : req.body.firstName,
        lastName : req.body.lastName,
        email : req.body.email,
        password : passwordHash,

    }

    const user = new User(userData) ;

    user.save().then(
        ()=>res.json({
            message : "User created successfully !"
        })
    ).catch(
        ()=>{
            res.json({
                message : "Failed to create user !"
            })
        }
    )

}

//create the login function
export function loginUser(req, res){
    const email = req.body.email ;
    const password = req.body.password ;

    User.findOne(
        {
            email : email   // request eken ena email ekata adala body eke ena email ekata samana emai ekak db eke tiyenawada kiyala balann kiyala me kiyanne 
        }
    ).then(
        (user)=>{
            if(user == null){
                res.status(404).json(
                    {
                        message : "User not found !!!" 
                    }
                )
            }else{
                const isPasswordCorrect = bcrypt.compareSync(password , user.password) 
                if(isPasswordCorrect){

                    // dta encrypr kirima
                    const token = jwt.sign({
                        email : user.email,
                        firstName : user.firstName,
                        lastName : user.lastName,
                        role : user.role,
                        isBlocked : user.isBlocked,
                        isEmailVerified : user.isEmailVerified,
                        image : user.image,

                    }, 
                    "CBC-6503" // encrpt key
                )


                    res.json(
                        {
                            token : token,
                            message : "Login Successful !"
                        }
                    )
                }else{
                    res.status(403).json({
                        message : "Incorrect password !!!"
                    })
                }
            }
        }
    )
}