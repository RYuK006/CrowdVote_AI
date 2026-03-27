const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  constituencyId: {
    type: String, // Matches constituencyId in Constituency model
    required: true
  },
  predictedAlliance: {
    type: String,
    enum: ['LDF', 'UDF', 'NDA', 'Others'],
    required: true
  },
  confidenceWeight: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent user from submitting multiple predictions for the same constituency
// In a real app, we might allow updates, but for now, we'll enforce uniqueness per user-constituency
predictionSchema.index({ userId: 1, constituencyId: 1 }, { unique: true });

module.exports = mongoose.model('Prediction', predictionSchema);
