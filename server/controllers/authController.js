const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'ecosphere_super_secret_jwt_key_devcamp2026_secure',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'customer',
      ecoPoints: 50, // Welcome bonus points
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ecoPoints: user.ecoPoints,
        ecoJourneyStage: user.ecoJourneyStage,
        wishlist: user.wishlist,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id);

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ecoPoints: user.ecoPoints,
        ecoJourneyStage: user.ecoJourneyStage,
        wishlist: user.wishlist,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ecoPoints: user.ecoPoints,
        ecoJourneyStage: user.ecoJourneyStage,
        wishlist: user.wishlist,
        completedChallenges: user.completedChallenges,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Demo Quick Login (Judge / Reviewer convenience)
// @route   POST /api/auth/demo-login
// @access  Public
const demoLogin = async (req, res, next) => {
  try {
    const { role = 'customer' } = req.body;
    const email = role === 'admin' ? 'admin@ecosphere.dev' : 'demo@ecosphere.dev';

    let user = await User.findOne({ email });
    if (!user) {
      // Auto-create if not already seeded
      user = await User.create({
        name: role === 'admin' ? 'EcoSphere Admin' : 'Demo Customer',
        email,
        password: role === 'admin' ? 'EcoAdmin123!' : 'EcoDemo123!',
        role: role === 'admin' ? 'admin' : 'customer',
        ecoPoints: role === 'admin' ? 850 : 320,
      });
    }

    const token = generateToken(user._id);

    return res.json({
      success: true,
      message: `Logged in as ${role === 'admin' ? 'Admin' : 'Customer'} demo user`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ecoPoints: user.ecoPoints,
        ecoJourneyStage: user.ecoJourneyStage,
        wishlist: user.wishlist,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  demoLogin,
};
