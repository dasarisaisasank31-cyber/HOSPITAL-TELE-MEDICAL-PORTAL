export interface FallbackUser {
  id: string;
  name: string;
  email: string;
  passwordPlain?: string;
  passwordHash?: string;
  role: string;
  specialization?: string;
}

const globalForUsers = global as unknown as {
  fallbackUsersMap?: Map<string, FallbackUser>;
};

if (!globalForUsers.fallbackUsersMap) {
  globalForUsers.fallbackUsersMap = new Map<string, FallbackUser>();

  // Pre-populate with standard demo accounts
  const demoAccounts: FallbackUser[] = [
    {
      id: "admin-1",
      name: "MediConnect Admin",
      email: "admin@mediconnect.in",
      passwordPlain: "Admin@123",
      role: "ADMIN",
    },
    {
      id: "doc-demo-1",
      name: "Dr. Priya Sharma",
      email: "doctor@mediconnect.in",
      passwordPlain: "Doctor@123",
      role: "DOCTOR",
      specialization: "Cardiologist",
    },
    {
      id: "patient-demo-1",
      name: "Demo Patient",
      email: "patient@mediconnect.in",
      passwordPlain: "Patient@123",
      role: "PATIENT",
    },
    {
      id: "patient-demo-2",
      name: "Sai",
      email: "sai@mediconnect.in",
      passwordPlain: "123456",
      role: "PATIENT",
    },
  ];

  for (const acc of demoAccounts) {
    globalForUsers.fallbackUsersMap.set(acc.email.toLowerCase(), acc);
  }
}

export const fallbackUsers = globalForUsers.fallbackUsersMap;

export function addFallbackUser(user: FallbackUser) {
  fallbackUsers.set(user.email.toLowerCase(), user);
}

export function getFallbackUser(email: string): FallbackUser | undefined {
  return fallbackUsers.get(email.toLowerCase());
}
