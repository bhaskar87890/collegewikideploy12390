import { User } from "./user.model.js";
import crypto from "crypto";
import bcryptjs from 'bcryptjs';
import path from 'path';
import { generateTokenAndSetCookie } from "./generateTokenAndSetCookie.js";
import { sendverificationEmail, sendWelcomeEmail,sendPasswordResetEmail,sendResetSuccessEmail } from "./emails2.js";


export const signup = async(req,res) => {
    console.log("At signin route");
    console.log(req.body);
    const {email,password,name} =req.body;
    try{
        if(!email || !password || !name){
            throw new Error("All fields are required");
        }

        const userAlreadyExists = await User.findOne({email});
        console.log("userAlreadyExists",userAlreadyExists);
        if(userAlreadyExists){
            return res.status(400).json({success:false,message:"User Already exists"});
        }
        console.log("Something wrong");
        const hashedpassword = await bcryptjs.hash(password,10);
        //12345 =hashpassword
        const verificationToken =Math.floor(100000 + Math.random() * 900000).toString();
        console.log("Varification token ", verificationToken);
        const user = new User ({
            email,
            password:hashedpassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 //24 hours
        })

        await user.save();

        //jwt
        generateTokenAndSetCookie(res,user._id);

        await sendverificationEmail(user.email,verificationToken);
        // res.status(201).json({
        //     success:true,
        //     message:"User created successfully",
        //     user:{
        //         ...user._doc,
        //         password:undefined,
        //     },
        // });
        res.status(200).sendFile("C:/Users/Bhaskar Samanta/Desktop/Projectnew/backend/codeemail.html")

    } catch (error){
        console.log(error);
        res.status(400).json({success:false,message:"User failed to access"});

    }
   // res.send("signup route");
};

export const verifyEmail = async(req,res) => {
    const {code} = req.body;
    console.log(code);
    try {
        const user = await User.findOne({
            verificationToken:code,
            verificationTokenExpiresAt : { $gt : Date.now()}
        })
        if(!user){
            return res.status(400).json({success:false,message:"Invalid or expired verification code"});
           
        }


        user.isVerified =true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email,user.name);
       // res.status(200).json({
           // success:true,
           // message:"Email verified successfully",
           // user : {
             //   ...user.doc,
               // password:undefined,
           // }
        //})
       // res.status(200).sendFile("C:/Users/Bhaskar Samanta/Desktop/Projectnew/backend/examplehome.html");
         res.status(200).sendFile("C:/Users/Bhaskar Samanta/Desktop/Projectnew/frontend2/Homepage.html");




        
    } catch (error) {
        console.log("error in verifyEmail", error);
        res.status(500).json({success:false,message:"Server Error"});
        
    }

};




export const login = async(req,res) => {

    const {name, password} = req.body;
   try {
    const user = await User.findOne({name});
    if (!user) {
        return res.status(400).json({success:false ,message:"Invalid credentials"});
    }
    const isPasswordValid = await bcryptjs.compare(password,user.password); 
    if(!isPasswordValid){
        return res.status(400).json({success:false ,message:"Invalid credentials"});

    }
    generateTokenAndSetCookie(res,user._id);

    user.lastlogin = new Date();
    await user.save();
  //  res.status(200).json({
      //  success:true,
      //  message:"Logged in successfully",
      //  user : {
        //    ...user.doc,
        //    password:undefined,
       // }
    //})
    
      //  res.redirect('/dashboard');
    res.status(200).sendFile("C:/Users/Bhaskar Samanta/Desktop/Projectnew/backend/dashboard.html");


    
   } catch (error) {
    console.log("Error in login",error);
    res.status(400).json({success:false,message:error.message});
   
    
   }
}

export const logout = async(req,res) => {
    console.log("In logout route")
   res.clearCookie("token");
   res.status(200).json({success :true, message:"Logged out successfully"});
    //res.status(200).sendFile("C:/Users/Bhaskar Samanta/Desktop/Projectnew/backend/examplehome.html");
  //  res.status(200).sendFile("C:/Users/Bhaskar Samanta/Documents/Collegewiki[1]/Collegewiki/Homepage.html");

    
}

export const forgotPassword = async(req,res) =>{
    const {email} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success:false ,message:"User not found"});
         }

         const resetToken = crypto.randomBytes(20).toString("hex");
         const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; //1hour

         user.resetPasswordToken = resetToken;
         user.resetPasswordExpiresAt = resetTokenExpiresAt;

         await user.save();

         //send email

         await sendPasswordResetEmail(user.email,`${process.env.CLIENT_URL}/reset-password/${resetToken}`);

         res.status(200).json({success:true,message:"Password reset link sent to your email"});
        
    } catch (error) {
        console.log("Error in forgotPassword",error);
        res.status(400).json({success:false, message:error.message});
        
    }
};

export const resetPassword = async(req,res) => {
    try {
        const {token} = req.params;
        const {password} = req.body;

        const user = await User.findOne({
            resetPasswordToken :token,
            resetPasswordExpiresAt :{$gt:Date.now()},

        });
        if(!user){
            return res.status(400).json({success:false, message:"Invalid or expired rest token"});
        }

        //update password
        const hashedPassword = await bcryptjs.hash(password,10);
        
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        await user.save();
        await sendResetSuccessEmail(user.email);

        res.status(200).json({success:true, message:"Password reset successful"});
        
    } catch (error) {
        console.log("Error in resetPassword", error);
        res.status(400).json({success:false,message:error.message });
        
    }
}

export const checkAuth = async(req,res)=>{
    try {
        const user = await User.findById(req.userId).select("-password");
        if(!user){
            return res.status(400).json({success:false ,message:"User not found"});
         }

         res.status(200).json({success:true, user});
        
    } catch (error) {
        console.log("Error in checkAuth",error);
        res.status(400).json({success:false , message:error.message});
        
    }
}

export const homePage = async (req,res) =>{
   // res.status(200).sendFile("C:/Users/Bhaskar Samanta/Desktop/Projectnew/backend/Homepage.html");
   res.status(200).sendFile("C:/Users/Bhaskar Samanta/Desktop/Projectnew/frontend2/Homepage.html");
   

}


