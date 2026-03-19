const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mayurishinde2805@gmail.com",
    pass: "cvnevlfnedvklsbo",
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendEmail = (to, otp) => {
  transporter.sendMail({
    from: "mayurishinde2805@gmail.com",
    to,
    subject: "Your OTP",
    text: `Your OTP is ${otp}`,
  }, (err, info) => {
    if (err) {
      console.log("Error sending email:", err.message);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

module.exports = sendEmail;
