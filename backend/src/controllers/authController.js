const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

/**
 * @desc    Authenticate with Phone
 * @route   POST /api/auth/phone
 * @access  Public
 */
exports.phoneAuth = async (req, res) => {
  try {
    const { token, fullName, action } = req.body;
    if (!token) return res.status(400).json({ success: false, message: 'Token missing' });

    const admin = require('../config/firebase-admin');
    const decodedToken = await admin.auth().verifyIdToken(token);
    const phoneNumber = decodedToken.phone_number;

    if (!phoneNumber) {
      return res.status(400).json({ success: false, message: 'Invalid phone token' });
    }

    let user = await User.findOne({ firebaseUid: decodedToken.uid });

    if (action === 'register') {
      if (user) {
        return res.status(400).json({ success: false, message: 'Account already exists. Please sign in.' });
      }
      if (!fullName) {
        return res.status(400).json({ success: false, message: 'Full Name is required for registration' });
      }
      user = await User.create({
        firebaseUid: decodedToken.uid,
        phoneNumber,
        fullName,
        role: 'user'
      });
    } else if (action === 'login') {
      if (!user) {
        return res.status(401).json({ success: false, message: 'Account not found. Please register.' });
      }
    } else {
      return res.status(400).json({ success: false, message: 'Invalid authentication action' });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        role: user.role,
        token: generateToken(user._id)
      }
    });
  } catch (err) {
    console.error('Phone Auth Error:', err);
    res.status(500).json({ success: false, message: 'Phone authentication failed' });
  }
};

/**
 * @desc    Admin login
 * @route   POST /api/auth/admin/login
 * @access  Public
 */
exports.loginAdmin = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const loginIdentity = email || username;

    const user = await User.findOne({ 
      email: loginIdentity 
    }).select('+password');

    if (user && user.role === 'admin' && (await user.matchPassword(password))) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
