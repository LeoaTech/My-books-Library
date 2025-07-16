const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmails = (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail" || process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
   

    from:
      process.env.EMAIL_FROM || '"Leoa Tech Team 👻" <komalraza258@gmail.com>', // sender address
    to: options.to , // list of receivers
    subject: options.subject , // Subject line
    text: options.text, // plain text body
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

module.exports = sendEmails;
