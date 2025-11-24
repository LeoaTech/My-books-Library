const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmails = (options) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail" || process.env.EMAIL_SERVICE,
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from:
      process.env.EMAIL_FROM || '"LeoaTech Team " <komalraza258@gmail.com>', 
    to: options.to, 
    subject: options.subject, 
    text: options.text,
  };

  // console.log(mailOptions, "Mail Options");

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

module.exports = sendEmails;
