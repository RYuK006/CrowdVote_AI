const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Badge definitions — static config
const BADGE_DEFINITIONS = {
  early_bird: { title: 'Early Bird', desc: 'Submitted a prediction in Pre-Election phase' },
  first_vote: { title: 'First Vote', desc: 'Cast your first prediction' },
  district_voter: { title: 'District Voter', desc: 'Predicted in 10+ constituencies' },
  district_master: { title: 'District Master', desc: 'Predicted all seats in a district' },
  full_coverage: { title: 'Full Coverage', desc: 'Predicted all 140 constituencies' },
  high_confidence: { title: 'High Conviction', desc: 'Submitted 5 predictions with max confidence' },
  streak_3: { title: 'Streak Builder', desc: 'Predicted 3 days in a row' },
  top_10: { title: 'Elite Predictor', desc: 'Ranked in the top 10 leaderboard' },
};

const badgeEntrySchema = new mongoose.Schema({
  badgeKey: { type: String, required: true },
  earnedAt: { type: Date, default: Date.now }
}, { _id: false });

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    unique: true,
    sparse: true
  },
  username: {
    type: String,
    required: [true, 'Please add a username'],
    unique: true,
    trim: true,
    maxlength: [100, 'Username cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  phoneNumber: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  rankScore: {
    type: Number,
    default: 100
  },
  influencePoints: {
    type: Number,
    default: 0
  },
  predictabilityScore: {
    type: Number,
    default: 0
  },
  predictionsMade: {
    type: Number,
    default: 0
  },
  correctPredictions: {
    type: Number,
    default: 0
  },
  badges: [badgeEntrySchema],
  lastActiveAt: {
    type: Date,
    default: Date.now
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user-entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if user has a specific badge
userSchema.methods.hasBadge = function(badgeKey) {
  return this.badges.some(b => b.badgeKey === badgeKey);
};

// Award a badge (no-op if already earned)
userSchema.methods.awardBadge = async function(badgeKey) {
  if (this.hasBadge(badgeKey)) return false;
  this.badges.push({ badgeKey, earnedAt: new Date() });
  await this.save();
  return true;
};

// Export badge definitions for use in controllers
userSchema.statics.BADGE_DEFINITIONS = BADGE_DEFINITIONS;

module.exports = mongoose.model('User', userSchema);
