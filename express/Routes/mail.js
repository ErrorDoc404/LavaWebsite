const client = require("../../"); // Assuming this is your Discord.js client
const api = require("express").Router();
const nodemailer = require('nodemailer');


const smtpConfig = client.config.mail;

const transporter = nodemailer.createTransport(smtpConfig);

api.post('/contact-us', async (req, res) => {
    return res.status(200).json({ message: `Disable for some reason` });
    try {
        const { subject, message } = req.body;

        const recipients = ['akashsinhakvs@gmail.com'];

        const mailOptions = {
            from: 'admin@kartadharta.xyz',
            subject: subject,
            to: recipients.join(', '),
            text: message,
        };

        // Send bulk emails
        const info = await transporter.sendMail(mailOptions);

        console.log('Bulk email sent:', info.response);
        res.status(200).json({ message: 'Bulk emails sent successfully.' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while sending bulk emails.' });
    }
});

module.exports = api;