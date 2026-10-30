const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  register,
  login,
  getMe,
  demoLogin,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validate');

// Validations
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/register', validate(registerValidation), register);
router.post('/login', validate(loginValidation), login);
router.get('/me', protect, getMe);
router.post('/demo-login', demoLogin);

module.exports = router;
