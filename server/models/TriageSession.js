const mongoose = require('mongoose');

const triageSessionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  symptoms: { type: String, required: true },
  aiResult: {
    possibleConditions: [String],
    recommendedSpecialist: String,
    urgencyLevel: { type: String, enum: ['low', 'medium', 'high'] },
    goToERImmediately: Boolean,
    advice: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TriageSession', triageSessionSchema);
