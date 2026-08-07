const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Appointment = require('./models/Appointment');
require('dotenv').config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hms-mern');
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Appointment.deleteMany({});

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Create Patient
    const patient = new User({
      name: 'Test Patient',
      email: 'patient@test.com',
      password: hashedPassword,
      role: 'PATIENT'
    });
    await patient.save();

    // Create Doctor
    const doctor = new User({
      name: 'Dr. Smith',
      email: 'doctor@test.com',
      password: hashedPassword,
      role: 'DOCTOR',
      specialization: 'General Physician',
      licenseNumber: 'MD12345'
    });
    await doctor.save();

    const neuro = new User({
      name: 'Dr. House',
      email: 'neuro@test.com',
      password: hashedPassword,
      role: 'DOCTOR',
      specialization: 'Neurologist',
      licenseNumber: 'MD67890'
    });
    await neuro.save();

    const cardio = new User({
      name: 'Dr. Watson',
      email: 'cardio@test.com',
      password: hashedPassword,
      role: 'DOCTOR',
      specialization: 'Cardiologist',
      licenseNumber: 'MD11223'
    });
    await cardio.save();


    // Create Pharmacist
    const pharma = new User({
      name: 'Test Pharmacist',
      email: 'pharma@test.com',
      password: hashedPassword,
      role: 'PHARMACIST'
    });
    await pharma.save();

    // Create Sample Appointment
    const appointment = new Appointment({
      patientId: patient._id,
      doctorId: doctor._id,
      scheduledAt: new Date(Date.now() + 86400000), // Tomorrow
      status: 'PENDING',
      notes: 'Regular checkup'
    });
    await appointment.save();

    console.log('Seed data created successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
