const nodemailer = require('nodemailer');

// Create a transporter object for sending email
const sendMail = async (email, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    const mailOption = {
        from: 'fredrickraymond2004@gmail.com',
        to: email,
        subject,
        text,
    };

    try {
        await transporter.sendMail(mailOption);
        console.log('Email sent successfully');
    } catch (error) {
        console.log('error sending email:', error);
        throw new BadRequest('Error sending email');
    }
};

module.exports = { sendMail };
