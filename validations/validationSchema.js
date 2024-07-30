const { body, validationResult } = require("express-validator");

const validateOtpRequest = [
  body("email")
    .isEmail()
    .withMessage("Invalid email address")
    .notEmpty()
    .withMessage("Email is required")
    .normalizeEmail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
const validateOtpVerification = [
  body("email")
    .isEmail()
    .withMessage("Invalid email address")
    .notEmpty()
    .withMessage("Email is required")
    .normalizeEmail(),
  body("otp")
    .notEmpty()
    .withMessage("OTP is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateRegisterRequest = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateLoginRequest = [
  body("email")
    .isEmail()
    .withMessage("Invalid email address")
    .notEmpty()
    .withMessage("Email is required")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateOtpRequest,
   validateOtpVerification,
  validateRegisterRequest,
  validateLoginRequest,
};