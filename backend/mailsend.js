import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const transporter = nodemailer.createTransport(
    {
        secure:true,
        host:'smtp.gmail.com',
        port :465,
        auth:{
            user:'bhaskarsamanta431@gmail.com',
            pass:'cocv dqpv lfqr aenp'

        }
    }
)

export const sender = {
 email:"bhaskarsamanta431@gmail.com",
 name:"Bhaskar",
};

export const recipient = {
  
 email: "bhaskarsamanta431@gmail.com",
  
};





transporter.sendMail({
        to:'bhaskarsamanta431@gmail.com',
        subject: 'My Subject',
        html:'<h1>How are you<h1>'
}) .then(() =>{
        console.log("Email Sent");
}).catch(err => {
        console.log(err);

    });




