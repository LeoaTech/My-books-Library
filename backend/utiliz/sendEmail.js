const sendEmails = require("./NodeEmail");

const send_email = async (email, subject, message) => {
  try {
    sendEmails({
      to: email,
      subject: subject,
      text: message,
    });
  } catch (error) {
    console.log(error);
  }
};


module.exports = send_email;





