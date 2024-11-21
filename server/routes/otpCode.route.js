const express = require('express');
const { verifyOtp, resendOtp } = require('../controllers/otpCode.controller');
const router = express.Router();

router.post('/verify', verifyOtp);
router.post('/resend', resendOtp);

module.exports = router;