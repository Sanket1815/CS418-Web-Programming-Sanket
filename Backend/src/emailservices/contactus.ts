const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
import * as dotenv from 'dotenv';
dotenv.config();

// Configure Mailgen
let mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: 'Course Advisory Portal',
    link: 'https://your-product-link.com',
  },
});

// Configure Nodemailer
let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.PASSWORD,
  },
});

// Function to send email
export async function sendContactus(userEmail, userName, message) {
  let email = {
    body: {
      name: 'Admin',
      intro: `Dear Admin, Student ${userName} with email ${userEmail} has raised a issue. Here is the issue - ${message}`,
      // text: token,
      outro: 'Thankyou',
    },
  };

  let emailBody = mailGenerator.generate(email);

  let mailOptions = {
    from: process.env.EMAIL_ID,
    to: process.env.EMAIL_ID,
    subject: 'Student Query',
    html: emailBody,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Login email sent to %s', process.env.EMAIL_ID);
  } catch (error) {
    console.error('Error sending login email:', error);
  }
}
