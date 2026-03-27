const mongoose = require('mongoose');

const systemConfigSchema = new mongoose.Schema({
  currentPhase: {
    type: String,
    enum: ['Pre-Election', 'Campaign', 'Final', 'Exit-Poll', 'Post-Result'],
    default: 'Pre-Election'
  },
  electionDate: {
    type: Date
  },
  predictionLocked: {
    type: Boolean,
    default: false
  },
  isMaintenanceMode: {
    type: Boolean,
    default: false
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SystemConfig', systemConfigSchema);
