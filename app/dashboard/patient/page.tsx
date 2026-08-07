"use client";
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useSession } from 'next-auth/react';
import { Stethoscope, Bot, Calendar as CalendarIcon, ArrowRight, Activity, Droplets, Loader2 } from 'lucide-react';

export default function PatientDashboard() {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/appointments').then(res => res.json()),
      fetch('/api/patient/profile').then(res => res.json())
    ]).then(([appts, prof]) => {
      setAppointments(Array.isArray(appts) ? appts : []);
      setProfile(prof.message ? null : prof);
      setLoading(false);
    }).catch(err => {
      console.error("Dashboard fetch error:", err);
      setLoading(false);
    });
  }, []);

  const todayAppointments = appointments.filter(a => {
    const date = new Date(a.scheduledAt);
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  });

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Welcome Card */}
        <div className="md:col-span-2 p-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl text-white shadow-[0_0_30px_rgba(6,182,212,0.3)] flex items-center justify-between overflow-hidden relative">
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-black mb-2 tracking-tight">Hello, {session?.user?.name || 'Patient'}!</h1>
            {loading ? <div className="h-6 w-48 bg-white/20 animate-pulse rounded mb-6"></div> : (
              <p className="text-blue-100 mb-6 font-medium">You have {todayAppointments.length} appointment(s) scheduled for today.</p>
            )}
            <a href="/doctors" className="px-6 py-3 bg-white text-blue-600 rounded-full font-bold hover:scale-105 transition-transform inline-flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.4)]">
              Book Appointment <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <Stethoscope className="w-48 h-48 opacity-10 absolute -right-8 -bottom-8 rotate-12 text-white" />
        </div>

        {/* AI Symptom Quick Access */}
        <div className="p-8 bg-white/[0.02] rounded-3xl border border-white/10 shadow-2xl flex flex-col justify-between backdrop-blur-xl group hover:border-cyan-500/30 transition-all">
          <div>
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20 mb-4 shadow-[inset_0_0_15px_rgba(168,85,247,0.1)]">
              <Bot className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">AI Symptom Checker</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Describe your symptoms and get a specialist recommendation instantly.</p>
          </div>
          <a href="/dashboard/patient/symptom-check" className="mt-6 text-cyan-400 font-bold text-sm hover:underline inline-flex items-center gap-1">Start Chat <ArrowRight className="w-3 h-3" /></a>
        </div>

        {/* Upcoming Appointments */}
        <div className="md:col-span-2 bg-white/[0.02] rounded-3xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl">
          <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-bold text-white">Upcoming Appointments</h3>
            <a href="/dashboard/patient/appointments" className="text-cyan-400 text-sm font-bold hover:underline">View All</a>
          </div>
          <div className="p-8">
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 text-cyan-500 animate-spin" /></div>
            ) : appointments.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No upcoming appointments found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.slice(0, 3).map((appt) => (
                  <div key={appt.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div>
                      <p className="font-bold text-white">{appt.doctor?.fullName || "Doctor"}</p>
                      <p className="text-sm text-cyan-400">{new Date(appt.scheduledAt).toLocaleString()}</p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 bg-white/10 rounded-full text-gray-300">{appt.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Health Stats */}
        <div className="bg-white/[0.02] rounded-3xl border border-white/10 shadow-2xl p-8 backdrop-blur-xl">
          <h3 className="font-bold text-white mb-6">Recent Health Record</h3>
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 text-cyan-500 animate-spin" /></div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">
                <span className="text-sm font-medium text-gray-400 flex items-center gap-2"><Activity className="w-4 h-4 text-cyan-400" /> Weight</span>
                <span className="font-bold text-white">{profile?.weight ? `${profile.weight} kg` : '--'}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">
                <span className="text-sm font-medium text-gray-400 flex items-center gap-2"><Activity className="w-4 h-4 text-cyan-400" /> Blood Pressure</span>
                <span className="font-bold text-white">{profile?.bloodPressure || '--'}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">
                <span className="text-sm font-medium text-gray-400 flex items-center gap-2"><Droplets className="w-4 h-4 text-red-500" /> Blood Group</span>
                <span className="font-bold text-red-400 shadow-[0_0_10px_rgba(248,113,113,0.3)] px-2 py-0.5 rounded bg-red-500/10">{profile?.bloodGroup || '--'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
