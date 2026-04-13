import { User } from "../models/userModel.js";
import bcryptjs from "bcrypt";
import jwt from "jsonwebtoken";

export const Login = async(req,res)=>{
    try{
        // take mail and password
        const {email,password} = req.body;
        // if no maild id or password are not matched with eachpther
        if(!email || !password){
            return res.status(401).json({
                message:"Invalid data",
                success:false
            })
        };
        // find user through email id in database 
        const user = await User.findOne({email});
        // if no user found i.e email found (email is imp cos user cannot use 1 mail id more than one time)
        if(!user){
            return res.status(401).json({
            message:"Invalid email or password",
            success: false    
            });
        }
        // see whether fronend password is matching with database hashed password or not
        const isMatch = await bcryptjs.compare(password, user.password);
        
        // frontend password != database password
        if(!isMatch){
            return res.status(401).json({
                message:"Invalid email or password",
                success: false
            });
        }

        // frontend password == database password
        // then will genrate token i.e jwt
        // cos on the basis of token we are going to decide whether user is logged in ot not

        const tokenData = {
            id:user._id
        }
        const token = await jwt.sign(tokenData, "blhblfvblfre",{expiresIn:"1d"});

        return res.status(200).cookie("token", token,{httpOnly:true}).json({
            message:`Welcome back ${user.fullName}`,
            success:true
        });

    }catch(error){
        console.log(error);
        
    }
}

export const Logout = async (req,res) => {
    return res.status(200).cookie("token", "", {expiresIn:new Date(Date.now()), httpOnly:true}).json({
        message:"User logged out successfully.",
        success:true,
    });
}

export const Register = async(req,res) => {
    try{

        const {fullName,email,password} = req.body;
        if(!fullName || !email || !password){
            return res.status(400).json({
                message:"All fields are required",
                success:false
            });
        }

        // check-->user cannot used same email ID more than once
        const user = await User.findOne({email});
        if(user){
            return res.status(409).json({
                message:"User already exists",
                success:false
            });
        }

        // if no user then create user
        // using hashed password(otherwise password will be visible in database)

        const hashedPassword = await bcryptjs.hash(password,16)
        await User.create({
            fullName,
            email,
            password:hashedPassword
        });

        return res.status(201).json({
            message:"Account created successfully."
        })
    }catch(error){
        console.log(error);
        
    }
}