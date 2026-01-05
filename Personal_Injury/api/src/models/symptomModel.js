const mongoose = require('mongoose');

const symptomSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  symptoms: {
    confusion: mongoose.Schema.Types.Mixed,
    affectedVision: mongoose.Schema.Types.Mixed,
    balanceLoss: mongoose.Schema.Types.Mixed,
    consciousnessLoss: mongoose.Schema.Types.Mixed,
    feelingDazed: mongoose.Schema.Types.Mixed,
    noiseSensitivity: mongoose.Schema.Types.Mixed,
    lightSensitivity: mongoose.Schema.Types.Mixed,
    tinnitus: mongoose.Schema.Types.Mixed,
    nausea: mongoose.Schema.Types.Mixed,
  },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Symptom', symptomSchema);