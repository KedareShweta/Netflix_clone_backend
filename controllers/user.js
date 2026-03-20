import { User } from "../models/userModel.js";

const Register = async(req,res) => {
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
            return res.status(400).json({
                message:"User already exists",
                success:false
            });
        }
    }catch(error){

    }
}