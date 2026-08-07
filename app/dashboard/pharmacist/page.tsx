"use client";
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Pill, Search, CheckCircle, FileText, Loader2 } from 'lucide-react';

export default function PharmacistDashboard() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/prescriptions')
      .then(res => res.json())
      .then(data => {
        setPrescriptions(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch prescriptions", err);
        setLoading(false);
      });
  }, []);
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-white">Incoming Prescriptions</h1>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" placeholder="Search by patient ID..." className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all w-full md:w-64 placeholder-gray-500" />
            </div>
            <button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:scale-105 transition-all">Search</button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-white/10 backdrop-blur-xl">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4 opacity-50" />
            <p className="text-gray-400 font-medium">No pending prescriptions found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {prescriptions.map((rx) => (
              <div key={rx.id} className="bg-white/[0.02] p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 backdrop-blur-xl hover:bg-white/[0.04] transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400 shadow-[inset_0_0_15px_rgba(34,211,238,0.1)]">
                    <Pill className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">{rx.id}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-1">Patient ID: {rx.patientId.slice(-6)}</h3>
                    <p className="text-sm text-gray-400 mt-1 max-w-md truncate">{rx.medications || "No specific medications listed"}</p>
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-xs text-gray-500 mb-4">{new Date(rx.issuedAt).toLocaleString()}</p>
                  <div className="flex gap-3">
                    {rx.pdfUrl ? (
                      <a href={rx.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-white/5 transition-all">
                        <FileText className="w-4 h-4" /> View PDF
                      </a>
                    ) : (
                      <button disabled className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-xl text-xs font-bold text-gray-500 bg-white/5 cursor-not-allowed">
                        <FileText className="w-4 h-4" /> No PDF
                      </button>
                    )}
                    <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-105 transition-all">
                      <CheckCircle className="w-4 h-4" /> Mark as Dispensed
                    </button>
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
