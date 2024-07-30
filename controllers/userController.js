const Otp = require('../models/otpSchema');
const User = require('../models/userSchema');
const sendToken = require('../utils/jwtTokens');
const jwt = require('jsonwebtoken');
const verifyOtp = require('../controllers/otpController');
const statusCodes = require('../validations/statusCodes');
const messages = require('../validations/messagesDefault');

const register = async (req, res) => {
  const { username, password, email, address } = req.body;
  
  if (!username || !password || !email || !address) {
    return res.status(statusCodes.BAD_REQUEST).json({ success: false, message: messages.PROVIDE_VALUES });
  }

  try {
    const otpEntry = await Otp.findOne({ where: { email: email } });
    const {otpToken} = otpEntry
    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET)
    const {email: emailD} = decoded 
    
    if (!otpEntry) {
      return res.status(statusCodes.BAD_REQUEST).json({ success: false, message: messages.INVALID_OTP_TOKEN });
    }
    
    // Check if the email from the token matches the email provided
    if (email !== emailD) {
      return res.status(statusCodes.BAD_REQUEST).json({ success: false, message: messages.INVALID_CREDENTIALS });
    }
    
    // Check if the username is already registered
    const isUser = await User.findOne({ where: { username } });
    if (isUser) {
      return res.status(statusCodes.BAD_REQUEST).json({ success: false, message: messages.USER_EXISTS});
    }

    // Create the user
    const user = await User.create({ username, password, email, address });
    sendToken(user, 201, res, messages.REGISTER_SUCCESS);

  } catch (error) {
    return res.status(statusCodes.BAD_REQUEST).json({ success: false, message: messages.INVALID_OTP_TOKEN});
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(statusCodes.BAD_REQUEST).json({ success: false, message: messages.PROVIDE_VALUES });
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(statusCodes.BAD_REQUEST).json({ success: false, message: messages.INVALID_CREDENTIALS });
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return res.status(statusCodes.BAD_REQUEST).json({ success: false, message: messages.INVALID_CREDENTIALS });
  }

  sendToken(user, statusCodes.OK, res,messages.LOGIN_SUCCESS);
};

const logout = async (req, res) => {
  res.status(statusCodes.OK).cookie("token", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
  }).json({
    success: true,
    message: messages.LOGOUT_SUCCESS,
  });
};

const getUser = async (req, res) => {
  const user = req.body;
  res.status(statusCodes.OK).json({
    success: true,
    user,
  });
};

module.exports = {
  register,
  login,
  logout,
  getUser
};
