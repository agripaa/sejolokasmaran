const User = require('../models/User');
const OtpCode = require('../models/OtpCode');
const nodemailer = require('nodemailer');
require('dotenv').config();

module.exports = {
    verifyOtp: async function (req, res) {
        const { otp } = req.body;

        try {
            const otpRecord = await OtpCode.findOne({ where: { code: otp } });

            if (!otpRecord) {
                return res.status(404).json({ status: 404, msg: "Invalid OTP!" });
            }

            if (otpRecord.expired < new Date()) {
                return res.status(400).json({ status: 400, msg: "OTP has expired!" });
            }

            await OtpCode.destroy({where: {id: otpRecord['id']}});
            res.status(200).json({ status: 200, msg: "OTP verified successfully!" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error verifying OTP', details: error });
        }
    },
    resendOtp: async function (req, res) {
        const { email } = req.body;

        try {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json({ status: 404, msg: "User not found!" });
            }

            const otpCode = Math.floor(100000 + Math.random() * 900000);
            const expired = new Date(Date.now() + 10 * 60 * 1000); 

            const existingOtp = await OtpCode.findOne({ where: { userId: user['id'] } });
            if (existingOtp) {
                await existingOtp.update({ code: otpCode, expired });
            } else {
                await OtpCode.create({ code: otpCode, expired, userId: user['id'] });
            }

            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL_SENDER,
                    pass: process.env.PASS_EMAIL_SENDER,
                },
            });

            const mailOptions = {
                from: process.env.EMAIL_SENDER,
                to: user.email,
                subject: 'Your OTP Code for Sejoli Kasmaran',
                text: `Hello ${user.username},\n\nYour OTP code is: ${otpCode}\n\nThis code will expire in 10 minutes.`,
            };

            try {
                await transporter.sendMail(mailOptions);
            } catch (emailError) {
                console.error(emailError);
                return res.status(500).json({ status: 500, msg: "Failed to send OTP email. Please try again." });
            }

            res.status(200).json({ status: 200, msg: "OTP resent successfully!" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error resending OTP', details: error });
        }
    },
}