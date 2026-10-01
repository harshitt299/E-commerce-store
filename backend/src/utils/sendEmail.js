import nodemailer from "nodemailer";
import dotenv from "dotenv"
dotenv.config();




const transporter = nodemailer.createTransport({
    host : process.env.SMTP_HOST,
    port : process.env.SMTP_PORT,
    secure : Number(process.env.SMTP_PORT)===465,
    auth : {
        user : process.env.SMTP_USER,
        pass : process.env.SMTP_PASS,
    }
});

 const sendEmail = async({to, subject , html })=>{
    const mailOption = {
        from : process.env.SMTP_USER,
        to : to,
        subject : subject,
        html : html
    };

    try {
        const info = await transporter.sendMail(mailOption);
        return info;
    } catch (error) {
        throw error;
    }
};

export {sendEmail};