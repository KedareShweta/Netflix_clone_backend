import { User } from "../models/userModel.js";
import bcryptjs from "bcrypt"
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