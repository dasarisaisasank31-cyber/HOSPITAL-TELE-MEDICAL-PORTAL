const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheduledAt: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'], 
    default: 'PENDING' 
  },
  roomId: { type: String }, // For WebRTC
  notes: { type: String },
  labResults: [{ type: String }], // Array of file paths
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Appointment', appointmentSchema);
