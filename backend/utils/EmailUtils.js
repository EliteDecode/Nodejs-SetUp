/* The above code is creating a function that will send an email to the user. */
const nodemailer = require("nodemailer");

const sendMail = async function (email, subject, text) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    debug: true,
    auth: {
      user: "alexindevs@gmail.com", // your cPanel email address
      pass: process.env.EMAIL_PASS || "", // your cPanel email password
    },
  });

  await transporter.sendMail({
    from: "Tradeet Team",
    to: email,
    subject: subject,
    html: text,
  });
};

module.exports = sendMail;
