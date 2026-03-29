const jwt = require('jsonwebtoken');
const admin = require('../config/firebase-admin');
const User = require('../models/User');

/**
 * @desc    Protect routes - Handle both Custom JWT and Firebase ID Tokens
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    // Try verifying as Custom JWT first (Primary DB Auth)
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
        return next();
      }
    } catch (jwtErr) {
      // Not a valid custom JWT, attempt Firebase verify if it was a "Neural Sync" user
    }

    // Fallback: Verify Firebase ID Token
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      let user = await User.findOne({ firebaseUid: decodedToken.uid });

      if (!user) {
        return res.status(401).json({ success: false, message: 'User not registered. Please complete registration.' });
      }
      req.user = user;
      next();
    } catch (fbErr) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
  } catch (err) {
    console.error('Unified Auth Error:', err.message);
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

/**
 * @desc    Grant access to specific roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role) && !req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: `User role [${req.user.role}] is not authorized to access this route` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
