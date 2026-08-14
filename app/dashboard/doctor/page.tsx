"use client";
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useSession } from 'next-auth/react';
import { StatCard } from '@/components/widgets/StatCard';
import { GlassPanel } from '@/components/widgets/GlassPanel';
import { AnimatedButton } from '@/components/widgets/AnimatedButton';
import { AppointmentTimeline } from '@/components/widgets/AppointmentTimeline';
import { Users, FileText, IndianRupee, Star, Calendar, Loader2 } from 'lucide-react';

import DoctorPendingPage from './pending/page';

export default function DoctorDashboard() {
  const { data: session } = useSession();

  const [appointments, setAppointments] = useState<any[]>([]);
  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/appointments').then(res => res.json()),
      fetch('/api/doctor/stats').then(res => res.json())
    ]).then(([appts, statsRes]) => {
      setAppointments(Array.isArray(appts) ? appts : []);
      setStatsData(statsRes.message ? null : statsRes);
      setLoading(false);
    }).catch(err => {
      console.error("Dashboard fetch error:", err);
      setLoading(false);
    });
  }, []);

  if (!loading && statsData && statsData.isApproved === false) {
    return <DoctorPendingPage />;
  }

  const stats = [
    { title: "Today's Patients", value: statsData?.todaysPatients?.toString() || "0", icon: Users, trend: "Scheduled for today", trendDirection: "neutral" as const, delay: 100 },
    { title: "Pending Prescriptions", value: statsData?.pendingPrescriptions?.toString() || "0", icon: FileText, trend: "Requires action", trendDirection: (statsData?.pendingPrescriptions > 0 ? "down" : "neutral") as "up" | "down" | "neutral", delay: 200 },
    { title: "Monthly Earnings", value: `₹${statsData?.monthlyEarnings?.toLocaleString() || "0"}`, icon: IndianRupee, trend: "This month", trendDirection: "up" as const, delay: 300 },
    { title: "Avg. Rating", value: statsData?.avgRating?.toString() || "0.0", icon: Star, trend: `${statsData?.totalReviews || 0} reviews`, trendDirection: "neutral" as const, delay: 400 },
  ];

  const todayAppointments = appointments.filter(a => {
    const date = new Date(a.scheduledAt);
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  }).map(a => ({
    id: a.id,
    patientName: a.patient?.fullName || "Patient",
    time: new Date(a.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    status: a.status,
    type: "Video" as const
  }));

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        <div className="flex justify-between items-end animate-slide-up">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Welcome back, Dr. {session?.user?.name?.split(' ')[0] || 'Doctor'}</h1>
            <p className="text-gray-400 mt-2">Here is what's happening with your practice today.</p>
          </div>
          <div className="hidden sm:flex gap-4">
            <a href="/dashboard/doctor/instant-prescription">
              <AnimatedButton size="sm" variant="primary" className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-600">
                <FileText className="w-4 h-4" /> Instant Prescription
              </AnimatedButton>
            </a>
            <AnimatedButton size="sm" variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" /> View Calendar
            </AnimatedButton>
          </div>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-10 h-10 text-cyan-500 animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Queue */}
          <GlassPanel delay={500} className="lg:col-span-2 !p-0 overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <h3 className="font-bold text-white text-lg">Today's Timeline</h3>
              <a href="/dashboard/doctor/queue" className="text-cyan-400 text-sm font-bold hover:underline">Full Queue</a>
            </div>
            <div className="flex-1 p-8 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 text-cyan-500 animate-spin" /></div>
              ) : todayAppointments.length === 0 ? (
                <p className="text-gray-400 text-center py-10">No appointments scheduled for today.</p>
              ) : (
                <AppointmentTimeline appointments={todayAppointments} />
              )}
            </div>
          </GlassPanel>

          {/* Availability Summary */}
          <GlassPanel delay={600} className="flex flex-col">
            <h3 className="font-bold text-white text-lg mb-6">Weekly Availability</h3>
            <div className="space-y-4 flex-1">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, idx) => (
                <div key={day} className="flex items-center justify-between hover:bg-white/5 p-2 rounded-lg transition-colors cursor-pointer" style={{ animationDelay: `${700 + idx * 50}ms` }}>
                  <span className="text-sm font-bold text-gray-400">{day}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-white">9:00 AM - 5:00 PM</span>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                  </div>
                </div>
              ))}
              <div className="mt-8 pt-6 border-t border-white/5">
                <a href="/dashboard/doctor/availability">
                  <AnimatedButton variant="secondary" className="w-full">
                    Manage Schedule
                  </AnimatedButton>
                </a>
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </DashboardLayout>
  );
}
