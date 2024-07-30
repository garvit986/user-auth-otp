const User = require('../models/userSchema');
const Otp = require('../models/otpSchema');
const sendToken = require('../utils/jwtTokens');
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
const statusCodes = require('../validations/statusCodes');
const messages = require('../validations/messagesDefault');

const sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(statusCodes.OK).json({ success: false, message: messages.PROVIDE_VALUES });
  }

  // Remove expired OTPs before creating a new one
  await Otp.removeExpiredOtps();

  // Generate OTP
  const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });

  // Create OTP record
  await Otp.create({ email, otp });

  // Send OTP email
  // await Otp.sendVerificationEmail(email, otp);

  res.status(statusCodes.OK).json({ success: true, message: messages.OTP_SENT });
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const storedOtp = await Otp.findOne({ where: { email, otp } });

  if (!storedOtp) {
    return res.status(statusCodes.BAD_REQUEST).json({ success: false, message: messages.OTP_INVALID });
  }

  const otpToken = jwt.sign({ email, otp }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

  // Update the OTP entry with the otpToken
  await Otp.update({ otpToken }, { where: { email, otp } });

  res.status(statusCodes.OK).json({ success: true, message: "Email verified successfully.", otpToken });
};

module.exports = { sendOtp, verifyOtp };
