import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const role = (session.user as any).role?.toLowerCase();

  // Redirect based on role
  switch (role) {
    case "admin":
      redirect("/dashboard/admin");
    case "doctor":
      redirect("/dashboard/doctor");
    case "pharmacist":
      redirect("/dashboard/pharmacist");
    case "patient":
    default:
      redirect("/dashboard/patient");
  }
}
