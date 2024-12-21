const fs = require("fs");
const path = require("path");
const cors = require("cors"); 
const nodemailer = require("nodemailer");
const { dataToBind } = require("../helper");
require("dotenv").config({ path: "./.env.local" });

module.exports = async (req, res) => {

  // Enable CORS for this route (or globally if necessary)
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins (for testing purposes)

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests are allowed" });
  }

  const { name, email, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail", // Use Gmail or configure for your service
      auth: {
        user: process.env.EMAIL, // Fetch from environment variables
        pass: process.env.PASSWORD, // Fetch from environment variables
      },
    });

    // custom smtp
    /* const transporter = nodemailer.createTransport({
      host: "smtp.example.com",
      port: 587,
      secure: false, // true for port 465, false for 587
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    }); */

    const fsp = fs.promises;
    const htmlContent = await fsp.readFile(
      path.join(__dirname, "mailContent.html"),
      { encoding: "utf-8" }
    );
    const formattedHtml = dataToBind(htmlContent, {
      name: name,
      email: email,
      title: subject,
      message: message,
    });

    const mailOptions = {
      from: email, // Sender's email
      to: process.env.EMAIL, // Your email
      subject: `Elite Engineerings Contact Us: ${subject}`,
      html: formattedHtml,
      //text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Email error:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
};
