const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  alliance: { type: String, enum: ['LDF', 'UDF', 'NDA', 'OTH'], required: true },
  name: { type: String, required: true },
  party: { type: String, required: true },
  partyLogo: { type: String, default: null }
}, { _id: false });

const constituencySchema = new mongoose.Schema({
  constituencyId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  candidates: [candidateSchema],
  currentConsensus: {
    LDF: { type: Number, default: 0 },
    UDF: { type: Number, default: 0 },
    NDA: { type: Number, default: 0 },
    Others: { type: Number, default: 0 }
  },
  totalVotesPredicted: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  sourceUrl: {
    type: String
  },
  imageFiles: [{ type: String }],
  historical2021: {
    winnerFront: String,
    winnerName: String,
    winnerTotalVotes: Number,
    runnerUpName: String,
    runnerUpTotalVotes: Number,
    margin: Number,
    electors: Number,
    turnout: Number,
    nota: Number,
    rejected: Number
  }
});

module.exports = mongoose.model('Constituency', constituencySchema);
