const nodemailer = require('nodemailer')

const sendEmail = async options => { //options = subject line,content
  //   create transporter service that will send the email
  const transporter = nodemailer.createTransport({
    //service:'Gmail',
    host:process.env.EMAIL_HOST,
    port:process.env.EMAIL_PORT,
    auth:{
      user:process.env.EMAIL_USERNAME,
      pass:process.env.EMAIL_PASSWORD
    }
  })
//email options
const mailOptions = {
  from:' Azubuine Samuel  azubuinesamuel@gmail.com',
  to:options.email,
  subject:options.subject,
  text:options.message
  //html:
}

  await transporter.sendMail(mailOptions);
}
  module.exports = sendEmail;