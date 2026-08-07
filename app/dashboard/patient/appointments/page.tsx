"use client";
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Calendar as CalendarIcon, Video, Info, Plus } from 'lucide-react';

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/appointments')
      .then(res => res.json())
      .then(data => {
        setAppointments(data);
        setLoading(false);
      });
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">My Appointments</h1>
          <a href="/doctors" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:scale-105 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> Book New
          </a>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-32 bg-white/5 animate-pulse rounded-3xl border border-white/10"></div>)}
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white/[0.02] p-20 rounded-3xl border border-white/10 text-center text-gray-500 backdrop-blur-xl">
            <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-gray-600 opacity-50" />
            <p className="text-lg">No appointments found. Start by booking a doctor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {appointments.map((appt: any) => (
              <div key={appt.id} className="bg-white/[0.02] p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-xl hover:bg-white/[0.04] transition-all group hover:border-cyan-500/30">
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex flex-col items-center justify-center shadow-[inset_0_0_15px_rgba(34,211,238,0.1)]">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                      {new Date(appt.scheduledAt).toLocaleString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-xl font-black text-white">
                      {new Date(appt.scheduledAt).getDate()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{appt.doctor.fullName}</h3>
                    <p className="text-sm text-cyan-400 font-medium">{appt.doctor.specialization}</p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      Time: <span className="text-white">{new Date(appt.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold border ${
                    appt.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 
                    appt.status === 'PENDING' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.2)]' : 'bg-white/5 text-gray-400 border-white/10'
                  }`}>
                    {appt.status}
                  </span>
                  <div className="flex gap-3">
                    <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 text-gray-300 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-xs font-bold">
                      <Info className="w-4 h-4" /> Details
                    </button>
                    {appt.status === 'CONFIRMED' && (
                      <a 
                        href={`/consult/room-${appt.id}`}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-xs font-bold hover:scale-[1.02] transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                      >
                        <Video className="w-4 h-4" /> Join Call
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
