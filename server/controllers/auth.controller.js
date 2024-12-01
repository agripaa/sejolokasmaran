const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Roles = require('../models/Roles');
const OtpCode = require('../models/OtpCode');
const RelationType = require('../models/RelationType');
const { use } = require('../routes/auth.route');
require('dotenv').config();

module.exports = {
    register: async function (req, res) {
        const { username, email, password, confPassword, role_id, relation_types } = req.body;
    
        try {
            if (!username || !email || !relation_types || !password) {
                return res.status(400).json({ status: 400, msg: "All fields are required!" });
            }
    
            if (password !== confPassword) {
                return res.status(401).json({ status: 401, msg: 'Password does not match!' });
            }
    
            let roleExist;
            if (!role_id) {
                roleExist = await Roles.findOne({ where: { role_name: "USER" } });
            } else {
                roleExist = await Roles.findOne({ where: { id: role_id } });
            }
    
            if (!roleExist) {
                return res.status(404).json({ status: 404, msg: "Role is not defined!" });
            }
    
            const relationTypeExist = await RelationType.findOne({ where: { id: relation_types } });
            if (!relationTypeExist) {
                return res.status(404).json({ status: 404, msg: "Relation type is not defined!" });
            }
    
            const emailExist = await User.findOne({ where: { email } });
            if (emailExist) {
                return res.status(401).json({ status: 401, msg: "Email is already registered!" });
            }
    
            const otpCode = Math.floor(100000 + Math.random() * 900000);
            const expired = new Date(Date.now() + 10 * 60 * 1000);
    
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
                to: email,
                subject: 'Your OTP Code for Sejoli Kasmaran',
                text: `Hello ${username},\n\nYour OTP code is: ${otpCode}\n\nThis code will expire in 10 minutes.`,
            };
    
            try {
                await transporter.sendMail(mailOptions);
            } catch (emailError) {
                console.error(emailError);
                return res.status(500).json({ status: 500, msg: "Failed to send OTP email. Please try again." });
            }
    
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({
                username,
                email,
                password: hashedPassword,
                role_id: roleExist.id,
                relation_types,
            });
    
            const existingOtp = await OtpCode.findOne({ where: { userId: user.id } });
            if (existingOtp) {
                await existingOtp.update({ code: otpCode, expired });
            } else {
                await OtpCode.create({ code: otpCode, expired, userId: user.id });
            }
    
            res.status(201).json({
                message: 'User registered successfully. OTP sent to email.',
                user,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error registering user', details: error });
        }
    },

    login: async function (req, res) {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ where: { email } });
            const role = await Roles.findOne({ where: { id: user.role_id }});

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            if (!role) {
                return res.status(404).json({ error: 'Role not found' });
            }

            const otpExist = await OtpCode.findOne({where: {userId: user['id']}})
            if(otpExist) return res.status(401).json({status: 401, msg: "user must be verify!"})
            
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            
            const token = jwt.sign({ id: user.id, role: role.role_name }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.status(200).json({ message: 'Login successful', token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error logging in', details: error });
        }
    },

    logout: async function (req, res) {
        res.status(200).json({ message: 'Logout successful' });
    },

    profile: async function (req, res) {
        try {
            const user = await User.findOne({
                where: { id: req.userId },
                include: [Roles, RelationType],
            });
            if (!user) return res.status(404).json({ status: 404, msg: "User not found!" });

            res.status(200).json({ status: 200, result: user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error Get Profile in', details: error });
        }
    },
};
