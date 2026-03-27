import express from 'express';
import dotenv from 'dotenv';
import databaseConnection from './utils/database.js';
import cookieParser from 'cookie-parser';
import userRoute from "./routes/userRoute.js"


dotenv.config({path: ".env"});// load first
databaseConnection(); // then use env

const app = express();
// middlewares
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());

// // for understanding purpose-->controller
// app.get("/", (req,res)=> {
//     res.status(200).json({
//         message:"Hello i am coming from backend",
//         success:true
//     })
// })


// api
app.use("/api/v1/user", userRoute)
// http://localhost:8080/api/v1/user/endpoint(routes)


app.listen(process.env.PORT, () => {
    console.log(`Server listen at port ${process.env.PORT}`);    
});