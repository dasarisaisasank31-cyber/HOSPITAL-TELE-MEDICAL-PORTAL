import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_DOCTORS = [
  {
    id: "doc-1",
    fullName: "Dr. Priya Sharma",
    specialization: "Cardiologist",
    consultationFee: 800,
    licenseNumber: "MC-12345",
    experience: 12,
    qualifications: "MBBS, MD (Cardiology)",
    rating: 4.9,
    totalReviews: 24,
    isApproved: true,
    user: { email: "dr.priya.sharma@mediconnect.in" }
  },
  {
    id: "doc-2",
    fullName: "Dr. Rajesh Kumar",
    specialization: "General Physician",
    consultationFee: 400,
    licenseNumber: "MC-23456",
    experience: 15,
    qualifications: "MBBS, MD (General Medicine)",
    rating: 4.8,
    totalReviews: 38,
    isApproved: true,
    user: { email: "dr.rajesh.kumar@mediconnect.in" }
  },
  {
    id: "doc-3",
    fullName: "Dr. Anitha Reddy",
    specialization: "Dermatologist",
    consultationFee: 600,
    licenseNumber: "MC-34567",
    experience: 8,
    qualifications: "MBBS, DVD, MD (Dermatology)",
    rating: 4.9,
    totalReviews: 19,
    isApproved: true,
    user: { email: "dr.anitha.reddy@mediconnect.in" }
  },
  {
    id: "doc-4",
    fullName: "Dr. Suresh Patel",
    specialization: "Orthopedic",
    consultationFee: 700,
    licenseNumber: "MC-45678",
    experience: 10,
    qualifications: "MBBS, MS (Orthopedics)",
    rating: 4.7,
    totalReviews: 15,
    isApproved: true,
    user: { email: "dr.suresh.patel@mediconnect.in" }
  },
  {
    id: "doc-5",
    fullName: "Dr. Kavitha Nair",
    specialization: "Gynecologist",
    consultationFee: 650,
    licenseNumber: "MC-56789",
    experience: 11,
    qualifications: "MBBS, DGO, MD",
    rating: 4.9,
    totalReviews: 29,
    isApproved: true,
    user: { email: "dr.kavitha.nair@mediconnect.in" }
  },
  {
    id: "doc-6",
    fullName: "Dr. Vikram Merchant",
    specialization: "Neurologist",
    consultationFee: 900,
    licenseNumber: "MC-67890",
    experience: 14,
    qualifications: "MBBS, DM (Neurology)",
    rating: 5.0,
    totalReviews: 42,
    isApproved: true,
    user: { email: "dr.vikram.merchant@mediconnect.in" }
  },
  {
    id: "doc-7",
    fullName: "Dr. Meera Deshmukh",
    specialization: "Gastroenterologist",
    consultationFee: 750,
    licenseNumber: "MC-78901",
    experience: 9,
    qualifications: "MBBS, DM (Gastroenterology)",
    rating: 4.8,
    totalReviews: 17,
    isApproved: true,
    user: { email: "dr.meera.deshmukh@mediconnect.in" }
  },
  {
    id: "doc-8",
    fullName: "Dr. Arvind Swamy",
    specialization: "ENT Specialist",
    consultationFee: 500,
    licenseNumber: "MC-89012",
    experience: 7,
    qualifications: "MBBS, MS (ENT)",
    rating: 4.7,
    totalReviews: 14,
    isApproved: true,
    user: { email: "dr.arvind.swamy@mediconnect.in" }
  },
  {
    id: "doc-9",
    fullName: "Dr. Sneha Kulkarni",
    specialization: "Dentist",
    consultationFee: 450,
    licenseNumber: "MC-90123",
    experience: 6,
    qualifications: "BDS, MDS",
    rating: 4.9,
    totalReviews: 22,
    isApproved: true,
    user: { email: "dr.sneha.kulkarni@mediconnect.in" }
  },
  {
    id: "doc-10",
    fullName: "Dr. Rohan Mehta",
    specialization: "Ophthalmologist",
    consultationFee: 600,
    licenseNumber: "MC-01234",
    experience: 10,
    qualifications: "MBBS, MS (Ophthalmology)",
    rating: 4.8,
    totalReviews: 16,
    isApproved: true,
    user: { email: "dr.rohan.mehta@mediconnect.in" }
  },
  {
    id: "doc-11",
    fullName: "Dr. Farhan Akhtar",
    specialization: "Psychiatrist",
    consultationFee: 850,
    licenseNumber: "MC-11223",
    experience: 13,
    qualifications: "MBBS, MD (Psychiatry)",
    rating: 5.0,
    totalReviews: 31,
    isApproved: true,
    user: { email: "dr.farhan.akhtar@mediconnect.in" }
  },
  {
    id: "doc-12",
    fullName: "Dr. Deepa Rao",
    specialization: "Pediatrician",
    consultationFee: 550,
    licenseNumber: "MC-22334",
    experience: 9,
    qualifications: "MBBS, DCH, MD (Pediatrics)",
    rating: 4.9,
    totalReviews: 27,
    isApproved: true,
    user: { email: "dr.deepa.rao@mediconnect.in" }
  }
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const spec = searchParams.get("specialization");
    
    let doctors: any[] = [];
    try {
      doctors = await prisma.doctorProfile.findMany({
        where: {
          isApproved: true,
          specialization: spec ? { contains: spec } : undefined,
        },
        include: {
          user: {
            select: {
              email: true,
            }
          }
        }
      });
    } catch (e) {
      console.warn("DB query error in /api/doctors, utilizing fallback doctors list.");
    }

    if (!doctors || doctors.length === 0) {
      doctors = spec
        ? DEFAULT_DOCTORS.filter(d => d.specialization.toLowerCase().includes(spec.toLowerCase()))
        : DEFAULT_DOCTORS;
    }

    return NextResponse.json(doctors);
  } catch (error: any) {
    console.error("API Doctors Error:", error);
    return NextResponse.json(DEFAULT_DOCTORS);
  }
}

