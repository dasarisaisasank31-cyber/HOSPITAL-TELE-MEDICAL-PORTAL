import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export const generatePrescriptionPDF = async (data: any) => {
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const { doctor, patient, diagnosis, medications, instructions } = data;

    // Header
    page.drawText("MediConnect - Hospital Telemedicine Portal", {
      x: 50,
      y: 750,
      size: 20,
      font: boldFont,
      color: rgb(0, 0.4, 0.7),
    });

    // Doctor Info
    page.drawText(`Dr. ${doctor.fullName}`, { x: 50, y: 710, size: 14, font: boldFont });
    page.drawText(`${doctor.specialization} | License: ${doctor.licenseNumber}`, { x: 50, y: 695, size: 10, font });

    // Patient Info
    page.drawText("Patient Details", { x: 50, y: 660, size: 12, font: boldFont });
    page.drawText(`Name: ${patient.fullName}`, { x: 50, y: 645, size: 10, font });
    page.drawText(`Date: ${new Date().toLocaleDateString()}`, { x: 400, y: 645, size: 10, font });

    // Diagnosis
    page.drawText("Diagnosis", { x: 50, y: 610, size: 12, font: boldFont });
    page.drawText(diagnosis || "No specific diagnosis provided.", { x: 50, y: 595, size: 10, font });

    // Medications
    page.drawText("Medications", { x: 50, y: 560, size: 12, font: boldFont });
    let y = 540;
    page.drawText("Drug Name", { x: 50, y, size: 10, font: boldFont });
    page.drawText("Dosage", { x: 200, y, size: 10, font: boldFont });
    page.drawText("Frequency", { x: 300, y, size: 10, font: boldFont });
    page.drawText("Duration", { x: 450, y, size: 10, font: boldFont });

    y -= 20;
    medications.forEach((med: any) => {
      page.drawText(med.drugName, { x: 50, y, size: 10, font });
      page.drawText(med.dosage, { x: 200, y, size: 10, font });
      page.drawText(med.frequency, { x: 300, y, size: 10, font });
      page.drawText(med.duration, { x: 450, y, size: 10, font });
      y -= 15;
    });

    // Instructions
    y -= 20;
    page.drawText("Instructions", { x: 50, y, size: 12, font: boldFont });
    y -= 15;
    page.drawText(instructions || "Take as directed.", { x: 50, y, size: 10, font });

    // Footer
    page.drawText("This prescription is valid for 30 days. Digital Signature: MediConnect-Signed", {
      x: 50,
      y: 50,
      size: 8,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw error;
  }
};
