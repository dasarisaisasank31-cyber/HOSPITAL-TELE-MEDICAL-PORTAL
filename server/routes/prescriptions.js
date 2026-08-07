const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const { auth } = require('../middleware/auth');

// @route   GET api/prescriptions/patient
// @desc    Get prescriptions for current patient
router.get('/patient', auth, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patientId: req.user.id })
      .populate('doctorId', 'name specialization')
      .sort({ generatedAt: -1 });
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   POST api/prescriptions/:appointmentId/generate-pdf

// @desc    Generate signed PDF prescription
router.post('/:appointmentId/generate-pdf', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId).populate('patientId doctorId');
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

    const { medicines } = req.body;
    const prescription = new Prescription({
      appointmentId: appointment._id,
      patientId: appointment.patientId._id,
      doctorId: appointment.doctorId._id,
      medicines
    });

    const prescriptionId = prescription._id.toString();
    const uploadPath = path.join(__dirname, '../uploads/prescriptions');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    
    const fileName = `${prescriptionId}.pdf`;
    const filePath = path.join(uploadPath, fileName);
    
    // Generate QR Code
    const qrData = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify/${prescriptionId}`;
    const qrCodeImage = await QRCode.toDataURL(qrData);

    // Create HMAC Signature
    const secret = process.env.SIGN_SECRET || 'server-secret';
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(prescriptionId + JSON.stringify(medicines));
    const signature = hmac.digest('hex');

    // Create PDF
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(25).text('MEDICONNECT HOSPITAL', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`Prescription ID: ${prescriptionId}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();
    doc.text(`Doctor: Dr. ${appointment.doctorId.name}`);
    doc.text(`Patient: ${appointment.patientId.name}`);
    doc.moveDown();
    doc.text('Medicines:', { underline: true });
    medicines.forEach((m, i) => {
      doc.text(`${i+1}. ${m.name} - ${m.dosage} for ${m.duration} (${m.instructions})`);
    });
    
    doc.moveDown();
    doc.image(qrCodeImage, { fit: [100, 100], align: 'center' });
    doc.text('Scan to verify authenticity', { align: 'center', size: 10 });
    
    doc.moveDown();
    doc.fontSize(10).text(`Digital Signature: ${signature}`, { align: 'center', color: 'grey' });
    
    doc.end();

    prescription.pdfUrl = `/uploads/prescriptions/${fileName}`;
    prescription.signature = signature;
    prescription.generatedAt = new Date();
    await prescription.save();

    res.json({ downloadUrl: prescription.pdfUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// @route   GET api/prescriptions/:id/verify
// @desc    Public verification of prescription
router.get('/:id/verify', async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id).populate('patientId doctorId');
    if (!prescription) return res.status(404).json({ valid: false, error: 'Prescription not found' });

    const secret = process.env.SIGN_SECRET || 'server-secret';
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(prescription._id.toString() + JSON.stringify(prescription.medicines));
    const expectedSignature = hmac.digest('hex');

    const isValid = prescription.signature === expectedSignature;
    res.json({ 
      valid: isValid, 
      details: isValid ? {
        patient: prescription.patientId.name,
        doctor: prescription.doctorId.name,
        date: prescription.generatedAt,
        medicines: prescription.medicines
      } : null 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
