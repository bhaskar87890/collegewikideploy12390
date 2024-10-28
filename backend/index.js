import express from 'express';
import dotenv from "dotenv";
import cors from "cors" ;
import cookieParser from 'cookie-parser';
import { connectDB } from './connectDB.js';
import authRoutes from "./auth.route.js";
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
const PORT =  process.env.PORT || 5000;

app.use(cors({origin:"",credentials:true}));
app.use(express.urlencoded({ extended: true }));
// app.use(express.static('frontend2'));
app.use('/api/auth',express.static(path.join(__dirname, '../frontend2')));



app.use(express.json()); //allows us to handle requests with JSON payloads
app.use(cookieParser()); //allows us to parse imcoming cookies


//app.get("/", (req,res) => {  //to handle requests from http
// res.send("hello world 123!")
//});
app.use("/api/auth",authRoutes);




app.listen(PORT, () => {   // to connect the server
    connectDB(); 
 console.log("Server is running on port :" , PORT);
});

