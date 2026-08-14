"use client";
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useSession, signOut } from "next-auth/react";
import { Clock, ShieldAlert, LogOut, CheckCircle2, RefreshCw } from "lucide-react";

export default function DoctorPendingPage() {
  const { data: session } = useSession();

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 sm:p-12 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] text-center relative overflow-hidden">
          {/* Top glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 rounded-b-full blur-sm"></div>

          <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
            <Clock className="w-10 h-10 text-amber-400 animate-pulse" />
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3">
            Account Pending Approval
          </h1>

          <p className="text-gray-300 text-base max-w-lg mx-auto mb-8 leading-relaxed">
            Welcome, <span className="text-white font-bold">Dr. {session?.user?.name || "Doctor"}</span>! Your medical registration and credentials are currently being reviewed by the MediConnect Administration Team.
          </p>

          <div className="bg-black/40 border border-white/10 rounded-2xl p-6 mb-8 text-left max-w-xl mx-auto space-y-4">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Next Steps & Status
            </h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <span>Account created & credentials submitted successfully.</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span>Admin review in progress (typically completed within 24-48 hours).</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <RefreshCw className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <span>Once approved, full access to patient consultations and appointment management will be enabled automatically.</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3.5 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 font-bold text-sm flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            >
              <RefreshCw className="w-4 h-4" /> Check Approval Status
            </button>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 font-bold text-sm flex items-center gap-2 transition-all"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
