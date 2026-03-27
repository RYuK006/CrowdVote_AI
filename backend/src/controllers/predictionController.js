const Prediction = require('../models/Prediction');
const Constituency = require('../models/Constituency');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

// @desc    Get all constituencies
// @route   GET /api/predictions/constituencies
// @access  Private
exports.getConstituencies = async (req, res) => {
  try {
    const constituencies = await Constituency.find().sort({ constituencyId: 1 });
    res.status(200).json({ success: true, count: constituencies.length, data: constituencies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Submit a prediction
// @route   POST /api/predictions/submit
// @access  Private
exports.submitPrediction = async (req, res) => {
  const { constituencyId, predictedAlliance, confidenceWeight } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Check system lock
    const SystemConfig = require('../models/SystemConfig');
    const config = await SystemConfig.findOne();
    if (config && config.predictionLocked) {
      return res.status(403).json({ success: false, message: 'Predictions are currently locked' });
    }

    // Check if user already predicted for this constituency
    let prediction = await Prediction.findOne({ userId: req.user.id, constituencyId });
    let isUpdate = false;

    if (prediction) {
      // Update existing prediction
      prediction.predictedAlliance = predictedAlliance;
      prediction.confidenceWeight = confidenceWeight;
      prediction.createdAt = Date.now();
      await prediction.save();
      isUpdate = true;
    } else {
      // Create new prediction
      prediction = await Prediction.create({
        userId: req.user.id,
        constituencyId,
        predictedAlliance,
        confidenceWeight
      });

      // Update user stats
      user.predictionsMade = (user.predictionsMade || 0) + 1;
      user.influencePoints = (user.influencePoints || 0) + (confidenceWeight * 10);
      user.lastActiveAt = new Date();
      await user.save();

      // Badge: first_vote
      if (user.predictionsMade === 1) {
        const awarded = await user.awardBadge('first_vote');
        if (awarded) {
          await createNotification(user._id, 'badge', 'Badge Earned!', "You've earned the 'First Vote' badge for casting your first prediction.");
        }
      }

      // Badge: district_voter (10+ constituencies)
      const uniqueCount = await Prediction.distinct('constituencyId', { userId: user._id });
      if (uniqueCount.length >= 10 && !user.hasBadge('district_voter')) {
        await user.awardBadge('district_voter');
        await createNotification(user._id, 'badge', 'Badge Earned!', "You've earned the 'District Voter' badge for predicting in 10+ constituencies.");
      }

      // Badge: full_coverage (all 140)
      if (uniqueCount.length >= 140 && !user.hasBadge('full_coverage')) {
        await user.awardBadge('full_coverage');
        await createNotification(user._id, 'badge', 'Badge Earned!', "You've earned the 'Full Coverage' badge for predicting all 140 constituencies!");
      }

      // Badge: high_confidence (5 max-confidence predictions)
      if (confidenceWeight === 10) {
        const highConfCount = await Prediction.countDocuments({ userId: user._id, confidenceWeight: 10 });
        if (highConfCount >= 5 && !user.hasBadge('high_confidence')) {
          await user.awardBadge('high_confidence');
          await createNotification(user._id, 'badge', 'Badge Earned!', "You've earned the 'High Conviction' badge for 5 max-confidence predictions.");
        }
      }

      // Badge: early_bird (if in Pre-Election phase)
      if (config && config.currentPhase === 'Pre-Election' && !user.hasBadge('early_bird')) {
        await user.awardBadge('early_bird');
        await createNotification(user._id, 'badge', 'Badge Earned!', "You've earned the 'Early Bird' badge for submitting during Pre-Election phase.");
      }
    }

    // Create prediction notification
    const constituency = await Constituency.findOne({ constituencyId });
    const constName = constituency ? constituency.name : constituencyId;
    await createNotification(
      req.user.id, 
      'prediction',
      isUpdate ? 'Prediction Updated' : 'Prediction Submitted',
      `Your ${predictedAlliance} prediction for ${constName} has been ${isUpdate ? 'updated' : 'locked'} with confidence ${confidenceWeight}/10.`
    );

    // Recalculate swarm consensus
    const newConsensus = await aggregateSwarmConsensus(constituencyId);

    // Emit real-time update via Socket.io
    try {
      const io = require('../lib/socket').getIO();
      io.emit('consensusUpdate', {
        constituencyId,
        newConsensus,
        name: constName
      });
    } catch (socketErr) {
      // Socket may not be available in all contexts
    }

    res.status(201).json({
      success: true,
      data: prediction
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get user's predictions
// @route   GET /api/predictions/my-predictions
// @access  Private
exports.getMyPredictions = async (req, res) => {
  try {
    const predictions = await Prediction.find({ userId: req.user.id }).sort({ createdAt: -1 });

    // Enrich with constituency names
    const constituencyIds = predictions.map(p => p.constituencyId);
    const constituencies = await Constituency.find({ constituencyId: { $in: constituencyIds } })
      .select('constituencyId name district');
    
    const constMap = {};
    constituencies.forEach(c => { constMap[c.constituencyId] = c; });

    const enriched = predictions.map(p => ({
      ...p.toObject(),
      constituency: constMap[p.constituencyId] || null
    }));

    res.status(200).json({ success: true, count: enriched.length, data: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Swarm Aggregation Logic
const aggregateSwarmConsensus = async (constituencyId) => {
  const predictions = await Prediction.find({ constituencyId }).populate({
    path: 'userId',
    select: 'rankScore'
  });
  
  const aggregates = { LDF: 0, UDF: 0, NDA: 0, Others: 0 };
  let totalWeight = 0;

  predictions.forEach(p => {
    if (!p.userId) return;
    const weight = (p.userId.rankScore / 100) * p.confidenceWeight;
    const alliance = p.predictedAlliance === 'OTH' ? 'Others' : p.predictedAlliance;
    aggregates[alliance] = (aggregates[alliance] || 0) + weight;
    totalWeight += weight;
  });

  const consensus = {
    LDF: totalWeight > 0 ? (aggregates.LDF / totalWeight) * 100 : 0,
    UDF: totalWeight > 0 ? (aggregates.UDF / totalWeight) * 100 : 0,
    NDA: totalWeight > 0 ? (aggregates.NDA / totalWeight) * 100 : 0,
    Others: totalWeight > 0 ? (aggregates.Others / totalWeight) * 100 : 0
  };

  await Constituency.findOneAndUpdate(
    { constituencyId },
    { 
      currentConsensus: consensus,
      totalVotesPredicted: predictions.length,
      lastUpdated: Date.now()
    }
  );

  return consensus;
};
