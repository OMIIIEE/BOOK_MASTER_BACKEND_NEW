
const nodemailer = require('nodemailer')

const dotenv = require('dotenv');

const express = require('express');
const router = express.Router();


dotenv.config();
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
  logger: true, // Add this line for logging
  debug: true   // Add this line for debugging
  // debug: true, // Enable debug logging
});

const sendOTP = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP code for registering in ' THE BOOK CLUB '",
      text: `Your OTP code is ${otp}`,
    });
    console.log(`OTP email sent to ${email}`);
  } catch (error) {
    console.log("Error sending OTP email:", error);
  }
};

module.exports = sendOTP;