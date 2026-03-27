const SystemConfig = require('../models/SystemConfig');
const Constituency = require('../models/Constituency');
const Prediction = require('../models/Prediction');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { createNotification } = require('./notificationController');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res) => {
  try {
    const constituencyCount = await Constituency.countDocuments();
    const predictionCount = await Prediction.countDocuments();
    const userCount = await User.countDocuments({ role: 'user' });
    const config = await SystemConfig.findOne() || await SystemConfig.create({});

    // Predictions per alliance
    const allianceBreakdown = await Prediction.aggregate([
      { $group: { _id: '$predictedAlliance', count: { $sum: 1 } } }
    ]);

    // Recent predictions (last 24h)
    const recent24h = await Prediction.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    res.status(200).json({
      success: true,
      data: {
        constituencyCount,
        predictionCount,
        userCount,
        currentPhase: config.currentPhase,
        predictionLocked: config.predictionLocked,
        electionDate: config.electionDate,
        allianceBreakdown,
        recent24h
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get system configuration (public-facing for phase info)
// @route   GET /api/admin/config
// @access  Public (phase info is non-sensitive)
exports.getConfig = async (req, res) => {
  try {
    const config = await SystemConfig.findOne() || await SystemConfig.create({});
    res.status(200).json({
      success: true,
      data: {
        currentPhase: config.currentPhase,
        electionDate: config.electionDate,
        predictionLocked: config.predictionLocked,
        lastUpdated: config.lastUpdated
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update System Configuration (Phase/Lock)
// @route   PUT /api/admin/config
// @access  Private/Admin
exports.updateConfig = async (req, res) => {
  const { currentPhase, predictionLocked, electionDate } = req.body;

  try {
    let config = await SystemConfig.findOne();
    if (!config) {
      config = await SystemConfig.create({});
    }

    const oldPhase = config.currentPhase;

    if (currentPhase) config.currentPhase = currentPhase;
    if (predictionLocked !== undefined) config.predictionLocked = predictionLocked;
    if (electionDate) config.electionDate = electionDate;
    
    config.lastUpdated = Date.now();
    await config.save();

    // Broadcast phase change notification to all users
    if (currentPhase && currentPhase !== oldPhase) {
      const users = await User.find({ role: 'user' }).select('_id');
      const notificationPromises = users.map(u => 
        createNotification(
          u._id,
          'phase',
          'Phase Transition',
          `The election phase has changed from "${oldPhase}" to "${currentPhase}".`
        )
      );
      await Promise.allSettled(notificationPromises);

      // Real-time broadcast
      try {
        const io = require('../lib/socket').getIO();
        io.emit('phaseChange', { oldPhase, newPhase: currentPhase });
      } catch (e) {}
    }

    // Broadcast lock change
    if (predictionLocked !== undefined) {
      try {
        const io = require('../lib/socket').getIO();
        io.emit('lockChange', { predictionLocked: config.predictionLocked });
      } catch (e) {}
    }

    res.status(200).json({
      success: true,
      data: config
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Upload Official Results and Trigger Accuracy Calculation
// @route   POST /api/admin/results
// @access  Private/Admin
exports.updateOfficialResults = async (req, res) => {
  const { results } = req.body; // Array of { constituencyId, winnerAlliance }

  if (!results || !Array.isArray(results)) {
    return res.status(400).json({ success: false, message: 'Please provide results array' });
  }

  try {
    let processed = 0;

    for (const result of results) {
      const { constituencyId, winnerAlliance } = result;

      // Get all predictions for this constituency
      const predictions = await Prediction.find({ constituencyId });

      for (const pred of predictions) {
        const isCorrect = pred.predictedAlliance === winnerAlliance;
        
        // Update user stats
        const user = await User.findById(pred.userId);
        if (user) {
          if (isCorrect) {
            user.correctPredictions = (user.correctPredictions || 0) + 1;
            user.rankScore = Math.min(1000, user.rankScore + (pred.confidenceWeight * 5));
            user.influencePoints = (user.influencePoints || 0) + (pred.confidenceWeight * 20);
          } else {
            user.rankScore = Math.max(1, user.rankScore - (pred.confidenceWeight * 2));
          }
          await user.save();

          // Notify user
          const constituency = await Constituency.findOne({ constituencyId });
          await createNotification(
            user._id,
            'system',
            isCorrect ? 'Prediction Correct!' : 'Prediction Missed',
            `Your ${pred.predictedAlliance} prediction for ${constituency?.name || constituencyId} was ${isCorrect ? 'correct' : 'incorrect'}. Winner: ${winnerAlliance}.`
          );
        }
      }

      processed++;
    }

    // Check for top_10 badge
    const topUsers = await User.find({ role: 'user' }).sort({ rankScore: -1 }).limit(10);
    for (const topUser of topUsers) {
      if (!topUser.hasBadge('top_10')) {
        await topUser.awardBadge('top_10');
        await createNotification(topUser._id, 'badge', 'Elite Badge!', "You've entered the Top 10 leaderboard!");
      }
    }

    res.status(200).json({
      success: true,
      message: `Processed results for ${processed} constituencies`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
