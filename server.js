const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable cross-origin requests

app.post("/test", async (req, res) => {
    res.status(200).json({ message: "Test Route Active!", params: req.body });
})

// Email sending route
app.post("/send-email", async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    // Set up transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const fsp = fs.promises;
    const htmlContent = await fsp.readFile(path.join(__dirname, "mailContent.html"),{ encoding: "utf-8"})
    const formattedHtml = dataToBind(htmlContent, {
        name: name,
        email: email,
        title: subject,
        message: message
    });

    // Email options
    const mailOptions = {
      from: email,
      to: process.env.EMAIL,
      subject: `Elite Engineerings Contact Us: ${subject}`,
      html: formattedHtml,
      //text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send email." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
