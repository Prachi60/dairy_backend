// import nodemailer from "nodemailer"

// export const transporter =nodemailer.createTransport({
//     service:"gmail",
//     auth:{
//         user:process.env.EMAIL_USER,
//         pass:process.env.EMAIL_PASS
//     }

// })
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
});
