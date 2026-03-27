const express = require('express');
const router = express.Router();
const { 
  getLeaderboard, 
  getMe, 
  getMyStats,
  updateProfile,
  changePassword,
  deleteAccount
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Public
router.get('/leaderboard', getLeaderboard);

// Protected
router.get('/me', protect, getMe);
router.get('/me/stats', protect, getMyStats);
router.put('/me/profile', protect, updateProfile);
router.put('/me/password', protect, changePassword);
router.delete('/me', protect, deleteAccount);

module.exports = router;
