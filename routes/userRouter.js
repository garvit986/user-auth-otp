const express = require('express');
const { getUser, login, logout, register } = require('../controllers/userController');
const { sendOtp, verifyOtpAndLogin , verifyOtp} = require('../controllers/otpController');
const { validateRegisterRequest, validateLoginRequest, validateOtpRequest, validateOtpVerification } = require('../validations/validationSchema');

const router = express.Router();
router.post("/register",validateRegisterRequest,register)
router.post("/login",validateLoginRequest,login)
router.get("/logout",logout)
router.get("/getuser", getUser)
router.post("/verify",validateOtpVerification ,verifyOtp)
router.post("/send",validateOtpRequest, sendOtp)


module.exports = router;