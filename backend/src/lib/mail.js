import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT || 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});


export async function sendMail(to, subject, html) {
    try {
        const info = await transporter.sendMail({
            from: `"Varázs Szépségszalon" <${process.env.MAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log("Email sent:", info.envelope, info.response);
    } catch (err) {
        console.error("Email sending failed:", err.message);
    }
}

