const User = require('../models/User');
const Prediction = require('../models/Prediction');
const Constituency = require('../models/Constituency');
const bcrypt = require('bcryptjs');

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
// @access  Public
exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('username rankScore influencePoints predictionsMade badges createdAt')
      .sort({ rankScore: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get current user stats (for Analytics/Meta page)
// @route   GET /api/users/me/stats
// @access  Private
exports.getMyStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Count predictions
    const predictions = await Prediction.find({ userId: req.user.id });
    const predictionCount = predictions.length;

    // Unique constituencies predicted
    const uniqueConstituencies = [...new Set(predictions.map(p => p.constituencyId))];

    // Districts covered
    const constituencies = await Constituency.find({ 
      constituencyId: { $in: uniqueConstituencies } 
    }).select('district');
    const districtsCovered = [...new Set(constituencies.map(c => c.district))];

    // Rank position
    const rankPosition = await User.countDocuments({ 
      role: 'user', 
      rankScore: { $gt: user.rankScore } 
    }) + 1;

    const totalUsers = await User.countDocuments({ role: 'user' });

    // Accuracy (will be 0 until post-election)
    const accuracy = user.predictionsMade > 0 
      ? ((user.correctPredictions / user.predictionsMade) * 100).toFixed(1) 
      : 0;

    // Prediction history for chart (group by date)
    const predictionsByDate = predictions.reduce((acc, p) => {
      const date = new Date(p.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const chartData = Object.entries(predictionsByDate).map(([date, count]) => ({
      date,
      predictions: count
    }));

    // Badge definitions with earned status
    const badgeDefs = User.BADGE_DEFINITIONS;
    const badges = Object.entries(badgeDefs).map(([key, def]) => {
      const earned = user.badges.find(b => b.badgeKey === key);
      return {
        key,
        title: def.title,
        desc: def.desc,
        earned: !!earned,
        earnedAt: earned?.earnedAt || null
      };
    });

    // Milestones
    const milestones = [
      {
        title: 'District Voter',
        desc: `Predict in 10+ constituencies`,
        progress: Math.min(100, Math.round((uniqueConstituencies.length / 10) * 100)),
        target: 10,
        current: uniqueConstituencies.length
      },
      {
        title: 'Full Coverage',
        desc: 'Predict all 140 constituencies',
        progress: Math.min(100, Math.round((uniqueConstituencies.length / 140) * 100)),
        target: 140,
        current: uniqueConstituencies.length
      },
      {
        title: 'District Master',
        desc: `Cover all seats in one district`,
        progress: (() => {
          // Check if any district is fully covered
          const districtMap = {};
          constituencies.forEach(c => {
            districtMap[c.district] = (districtMap[c.district] || 0) + 1;
          });
          // This is approximate — real check needs total seats per district
          const maxCoverage = Math.max(...Object.values(districtMap), 0);
          return Math.min(100, Math.round((maxCoverage / 4) * 100)); // Min district has ~4 seats
        })(),
        target: 1,
        current: 0
      }
    ];

    res.status(200).json({
      success: true,
      data: {
        predictabilityScore: parseFloat(accuracy),
        rankPosition,
        totalUsers,
        rankPercentile: totalUsers > 0 ? ((1 - rankPosition / totalUsers) * 100).toFixed(1) : 0,
        influencePoints: user.influencePoints,
        predictionsMade: predictionCount,
        correctPredictions: user.correctPredictions,
        constituenciesPredicted: uniqueConstituencies.length,
        districtsCovered: districtsCovered.length,
        rankScore: user.rankScore,
        badges,
        milestones,
        chartData
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/me/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { username, email, phoneNumber } = req.body;
    const updateFields = {};

    if (username) {
      // Check uniqueness
      const existing = await User.findOne({ username, _id: { $ne: req.user.id } });
      if (existing) return res.status(400).json({ success: false, message: 'Username already taken' });
      updateFields.username = username;
    }
    if (email) {
      const existing = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (existing) return res.status(400).json({ success: false, message: 'Email already in use' });
      updateFields.email = email;
    }
    if (phoneNumber !== undefined) updateFields.phoneNumber = phoneNumber;

    const user = await User.findByIdAndUpdate(req.user.id, updateFields, { new: true, runValidators: true });

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Change password
// @route   PUT /api/users/me/password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/me
// @access  Private
exports.deleteAccount = async (req, res) => {
  try {
    // Delete user's predictions
    await Prediction.deleteMany({ userId: req.user.id });

    // Delete user's notifications
    const Notification = require('../models/Notification');
    await Notification.deleteMany({ userId: req.user.id });

    // Delete user
    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({ success: true, message: 'Account deleted permanently' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
