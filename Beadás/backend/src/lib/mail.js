// Nodemailer modul importálása az e-mailek küldéséhez
import nodemailer from "nodemailer";

// Környezeti változók betöltése a .env fájlból
import dotenv from "dotenv";
dotenv.config();

// E-mail küldéshez szükséges SMTP konfiguráció
// A belépési adatok és a szerver beállítások környezeti változókból érkeznek
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT || 465,
    secure: true, // SSL titkosított kapcsolat használata
    auth: {
        user: process.env.MAIL_USER, // bejelentkezési felhasználó
        pass: process.env.MAIL_PASS, // bejelentkezési jelszó
    },
});

// Általános célú függvény e-mail küldéshez
// Paraméterek:
//  - to: címzett e-mail címe
//  - subject: az e-mail tárgya
//  - html: HTML formátumú e-mail tartalom
export async function sendMail(to, subject, html) {
    try {
        const info = await transporter.sendMail({
            from: `"Varázs Szépségszalon" <${process.env.MAIL_USER}>`,
            to,
            subject,
            html,
        });

        // Küldés sikeres esetén konzol kimenet
        console.log("Email sent:", info.envelope, info.response);

    } catch (err) {
        // Hiba esetén hibaüzenet naplózása
        console.error("Email sending failed:", err.message);
    }
}
