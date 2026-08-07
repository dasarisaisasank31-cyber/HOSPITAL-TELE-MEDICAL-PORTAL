const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const Appointment = require('../models/Appointment');
const { auth, checkRole } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/lab-results/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });


// @route   GET api/appointments
// @desc    Get all appointments for user
router.get('/', auth, async (req, res) => {
  try {
    const filter = req.user.role === 'DOCTOR' ? { doctorId: req.user.id } : { patientId: req.user.id };
    const appointments = await Appointment.find(filter).populate('patientId doctorId', 'name email specialization');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   POST api/appointments
// @desc    Book appointment
router.post('/', auth, async (req, res) => {
  const { doctorId, scheduledAt, notes } = req.body;
  try {
    const appointment = new Appointment({
      patientId: req.user.id,
      doctorId,
      scheduledAt,
      notes
    });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   PATCH api/appointments/:id/start-call
// @desc    Generate roomId for WebRTC
router.patch('/:id/start-call', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    
    // Only the doctor or patient can start/get room
    if (appointment.patientId.toString() !== req.user.id && appointment.doctorId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    appointment.roomId = uuidv4();
    appointment.status = 'CONFIRMED';
    await appointment.save();
    res.json({ roomId: appointment.roomId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET api/appointments/:id/room
// @desc    Get roomId for appointment
router.get('/:id/room', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment || !appointment.roomId) return res.status(404).json({ error: 'Room not found' });
    
    if (appointment.patientId.toString() !== req.user.id && appointment.doctorId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json({ roomId: appointment.roomId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   POST api/appointments/:id/lab-results
// @desc    Upload lab results for an appointment
router.post('/:id/lab-results', [auth, upload.array('files')], async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

    const filePaths = req.files.map(file => `/uploads/lab-results/${file.filename}`);
    appointment.labResults.push(...filePaths);
    await appointment.save();

    res.json({ message: 'Files uploaded successfully', files: filePaths });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

