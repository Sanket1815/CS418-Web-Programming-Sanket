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
export async function sendStatusUpdate(userEmail, userName, term, status) {
  let email = {
    body: {
      name: userName,
      intro: `Dear ${userName}, your coursework for semester ${term} has been ${status}`,
      // text: token,
      outro: 'If you did not log in, please contact our support immediately.',
    },
  };

  let emailBody = mailGenerator.generate(email);

  let mailOptions = {
    from: process.env.EMAIL_ID,
    to: userEmail,
    subject: 'Advisory Record Status Update',
    html: emailBody,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Login email sent to %s', userEmail);
  } catch (error) {
    console.error('Error sending login email:', error);
  }
}
