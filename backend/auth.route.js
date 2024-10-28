import express from "express";
import { login, logout, signup,verifyEmail,forgotPassword,resetPassword,checkAuth,homePage} from './auth.controller.js';
import { verifyToken } from "./verifyToken.js";

const router = express.Router();

router.get("/check-auth",verifyToken,checkAuth);

router.post("/signup",signup);

//router.get("/signup",async (req,res)=>{
  //  await res.send("Hello User");
//})


router.post("/login",login);

router.post("/logout",logout);
//router.post("/dashboard",dashboard);


router.post("/verify-email",verifyEmail);
//router.get("/verify-email",async (req,res)=>{
  //  await res.send("Hello User");
//})

router.post("/forgot-password",forgotPassword);

router.post("/reset-password/:token",resetPassword);

router.get("/homepage",homePage);




export default router;

  