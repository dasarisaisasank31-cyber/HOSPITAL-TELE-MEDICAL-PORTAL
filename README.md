# MediConnect - Hospital Telemedicine Portal

MediConnect is a production-ready telemedicine platform built with Next.js 14, Prisma, PostgreSQL, and Redis. It provides a complete end-to-end solution for patients, doctors, pharmacists, and admins to manage healthcare consultations remotely.

## 🚀 Quick Start

Follow these 5 commands to get the project running locally:

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Setup Environment**
   ```bash
   cp .env.example .env.local
   # Update variables in .env.local if needed
   ```

3. **Start Infrastructure (Docker)**
   ```bash
   docker-compose up -d
   ```

4. **Initialize Database**
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui (custom), Zustand, Recharts.
- **Backend**: Next.js API Routes, Prisma ORM, NextAuth.js.
- **Infrastructure**: Docker, PostgreSQL, Redis.
- **Services**: 
  - **OpenAI**: AI Symptom Checker (GPT-4o).
  - **Twilio**: Video Consultations & SMS.
  - **Razorpay**: Payment Gateway.
  - **Resend**: Transactional Emails.
  - **AWS S3**: File Storage (Prescriptions/Reports).

## 👥 User Roles

1. **Patient**: Book appointments, consult via video, AI triage, download prescriptions.
2. **Doctor**: Manage queue, video consult, write e-prescriptions, view earnings.
3. **Admin**: Platform analytics, user management, doctor approvals.
4. **Pharmacist**: View incoming prescriptions, mark as dispensed.

## 🛡 Security

- JWT-based authentication via NextAuth.js.
- Role-based Access Control (RBAC) middleware.
- Input validation using Zod.
- Parameterized SQL queries via Prisma.
- Secure payment verification using HMAC signatures.

## 🌍 Multilingual Support

MediConnect supports **English, Hindi, and Telugu** (using `next-intl`).

---
Built with ❤️ for Indian Healthcare by MediConnect Team.
