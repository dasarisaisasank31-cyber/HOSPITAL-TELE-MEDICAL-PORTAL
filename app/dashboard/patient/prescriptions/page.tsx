"use client";
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { FileText, Pill, Download, Eye } from 'lucide-react';

export default function PatientPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/prescriptions')
      .then(res => res.json())
      .then(data => {
        setPrescriptions(data);
        setLoading(false);
      });
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">My Prescriptions</h1>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-40 bg-white/5 animate-pulse rounded-3xl border border-white/10"></div>)}
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="bg-white/[0.02] p-20 rounded-3xl border border-white/10 text-center text-gray-500 backdrop-blur-xl">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-600 opacity-50" />
            <p className="text-lg">No prescriptions issued yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prescriptions.map((rx: any) => (
              <div key={rx.id} className="bg-white/[0.02] p-6 rounded-3xl border border-white/10 shadow-2xl group hover:border-cyan-500/30 hover:bg-white/[0.04] transition-all backdrop-blur-xl">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center border border-cyan-500/20 shadow-[inset_0_0_15px_rgba(34,211,238,0.1)]">
                      <Pill className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest">ID: {rx.id}</p>
                      <h3 className="text-lg font-bold text-white">Issued on {new Date(rx.issuedAt).toLocaleDateString()}</h3>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-500">{new Date(rx.issuedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <div className="p-4 bg-white/5 border border-white/5 rounded-2xl mb-6">
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Instructions</h4>
                  <p className="text-sm text-gray-300 leading-relaxed italic">"{rx.instructions || 'Take as directed by doctor.'}"</p>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-white/10 transition-all">
                    <Eye className="w-4 h-4" /> View Details
                  </button>
                  <a 
                    href={rx.pdfUrl} 
                    target="_blank"
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-xs font-bold text-center hover:scale-[1.02] transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  >
                    <Download className="w-4 h-4" /> Download PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
