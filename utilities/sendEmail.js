const nodemailer = require('nodemailer');
const { PAGE_URL } = require('../config');

const sendEmail = async (userName, userEmail, subjectEmail, htmlBody, url) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    
      await transporter.sendMail({
        from: process.env.EMAIL_USER, // sender address
        to: userEmail, // list of receivers
        subject: subjectEmail, // Subject line
        html: `<p>
        Hola afable <span style="font-weight: bold;">${userName}</span>, <br> 
        Te dejo un enlace donde puedes <a href="${PAGE_URL}/${url}" style="color: black; font-weight: bolder;">${htmlBody}</a>. <br> 
        Saludos.
        </p>`, // html body
    });
};

module.exports = sendEmail;
