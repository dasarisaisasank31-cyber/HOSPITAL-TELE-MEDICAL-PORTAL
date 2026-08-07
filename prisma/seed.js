const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding started...");

  // Clear existing data
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("Admin@123", 12);

  // 1 Admin
  const admin = await prisma.user.create({
    data: {
      email: "admin@mediconnect.in",
      passwordHash,
      role: "ADMIN",
      isVerified: true,
    },
  });

  // 5 Doctors
  const doctorsData = [
    { name: "Dr. Priya Sharma", spec: "Cardiologist", fee: 800, lic: "MC-12345" },
    { name: "Dr. Rajesh Kumar", spec: "General Physician", fee: 400, lic: "MC-23456" },
    { name: "Dr. Anitha Reddy", spec: "Dermatologist", fee: 600, lic: "MC-34567" },
    { name: "Dr. Suresh Patel", spec: "Orthopedic", fee: 700, lic: "MC-45678" },
    { name: "Dr. Kavitha Nair", spec: "Gynecologist", fee: 650, lic: "MC-56789" },
  ];

  for (const doc of doctorsData) {
    const user = await prisma.user.create({
      data: {
        email: doc.name.toLowerCase().replace(/\s/g, ".") + "@mediconnect.in",
        passwordHash,
        role: "DOCTOR",
        isVerified: true,
        doctorProfile: {
          create: {
            fullName: doc.name,
            specialization: doc.spec,
            consultationFee: doc.fee,
            licenseNumber: doc.lic,
            experience: 10,
            qualifications: "MBBS, MD",
            isApproved: true,
            bio: `Highly experienced ${doc.spec} dedicated to providing quality care.`,
            languages: "English, Hindi, Telugu", // String for SQLite
          },
        },
      },
    });
  }

  // 10 Patients
  const patientsData = [
    "Rahul Verma", "Sita Devi", "Anil Kapoor", "Jyothi Lakshmi", "Suresh Kumar",
    "Priyanka Rao", "Vikram Singh", "Sunitha Reddy", "Mahesh Babu", "Ayesha Begum"
  ];

  for (const name of patientsData) {
    await prisma.user.create({
      data: {
        email: name.toLowerCase().replace(/\s/g, ".") + "@gmail.com",
        passwordHash,
        role: "PATIENT",
        isVerified: true,
        patientProfile: {
          create: {
            fullName: name,
            dateOfBirth: new Date(1990, 0, 1),
            gender: "Male",
            bloodGroup: "O+",
          },
        },
      },
    });
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
