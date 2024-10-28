import { PASSWORD_RESET_REQUEST_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE,PASSWORD_RESET_SUCCESS_TEMPLATE } from './emailTemplate.js'
import {transporter,sender} from './mailsend.js'


export const sendverificationEmail = async (email,verificationToken) => {
    const recipent = email;
    try {
        console.log(verificationToken);
        const response =await transporter.sendMail({
            from:sender,
            to:recipent,
            subject:"verify your email",
            html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken),
            
            category :"Email Verification"
        }) 

        console.log("Email sent successfully",response);
    }

    catch (error) {
        console.error(`Error sending information`,error);
        throw new Error(`Error sending verification email : ${error}`);
    
}
}

export const sendWelcomeEmail = async(email) => {
    const recipent = email;
    try {
      const response=  await transporter.sendMail({
            from:sender,
            to:recipent,
            subject:"Welcome To Proshostho",
            html:"<p>Thanks for Registering! We are happy to welcome you onboard.<p>"

            },


        );
        console.log("Email sent successfully",response);
        
    } catch (error) {
        console.error(`Error sending information`,error);
        throw new Error(`Error sending verification email : ${error}`);
    

        
    }
}

export const sendPasswordResetEmail =async (email,resetURL) => {
    const recipent = email;

    try {
        const response = await transporter.sendMail({
            from:sender,
            to:recipent,
            subject:"Reset your password",
           html:PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            
            category:"Password Reset",
        })
        
    } catch (error) {
        console.error(`Error sending password reset email`,error);

        throw new Error(`Error sending password reset email:${error}`);
        
    }

}

export const sendResetSuccessEmail = async(email) => {
    const recipent = email;
    try {
        const response = await transporter.sendMail({
            from:sender,
            to:recipent,
            subject :"Password Reset Successfull",
            html:PASSWORD_RESET_SUCCESS_TEMPLATE,
            category:"Password Reset",
        });
        console.log("Password reset sent successfully",response);
        
    } catch (error) {
        console.error(`Error sending password reset success email`,error);
        throw new Error(`Error sending password reset success email : ${error}`);
        
    

        }
    };