"use client";
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/widgets/StatCard';
import { GlassPanel } from '@/components/widgets/GlassPanel';
import {
  Users,
  Video,
  IndianRupee,
  Stethoscope,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  Loader2,
  UserCheck,
  ShieldCheck,
  Search
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');
  const [pendingDoctors, setPendingDoctors] = useState<any[]>([]);
  const [approvedDoctors, setApprovedDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/doctors');
      if (res.ok) {
        const data = await res.json();
        setPendingDoctors(data.pendingDoctors || []);
        setApprovedDoctors(data.approvedDoctors || []);
      }
    } catch (err) {
      console.error("Failed to fetch admin doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDoctorAction = async (doctorId: string, action: 'approve' | 'reject') => {
    try {
      setActionLoading(doctorId);
      const res = await fetch('/api/admin/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorId, action }),
      });
      if (res.ok) {
        await fetchDoctors();
      } else {
        const data = await res.json();
        alert(data.message || `Failed to ${action} doctor`);
      }
    } catch (err) {
      alert(`Error processing ${action} action`);
    } finally {
      setActionLoading(null);
    }
  };

  const kpis = [
    { title: "Pending Approvals", value: pendingDoctors.length.toString(), change: "Requires review", icon: Clock, trendDirection: "neutral" as const, delay: 100 },
    { title: "Approved Doctors", value: approvedDoctors.length.toString(), change: "Active on portal", icon: UserCheck, trendDirection: "up" as const, delay: 200 },
    { title: "Total Consultations", value: "1,248", change: "+14% this month", icon: Video, trendDirection: "up" as const, delay: 300 },
    { title: "Platform Revenue", value: "₹2,84,000", change: "+18% MTD", icon: IndianRupee, trendDirection: "up" as const, delay: 400 },
  ];

  const filterDoctors = (docs: any[]) => {
    if (!searchTerm.trim()) return docs;
    const term = searchTerm.toLowerCase();
    return docs.filter(d =>
      d.fullName?.toLowerCase().includes(term) ||
      d.specialization?.toLowerCase().includes(term) ||
      d.licenseNumber?.toLowerCase().includes(term) ||
      d.user?.email?.toLowerCase().includes(term)
    );
  };

  const displayedPending = filterDoctors(pendingDoctors);
  const displayedApproved = filterDoctors(approvedDoctors);

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-slide-up">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
              Admin Doctor Approvals
              <span className="px-3 py-1 text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Portal Control
              </span>
            </h1>
            <p className="text-gray-400 mt-1">Review medical credentials and manage doctor verifications.</p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-all w-full sm:w-64"
            />
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi) => (
            <StatCard key={kpi.title} {...kpi} trend={kpi.change} />
          ))}
        </div>

        {/* Tabs & Table Panel */}
        <GlassPanel delay={500} className="!p-0 overflow-hidden flex flex-col border border-white/10">
          <div className="px-8 py-5 border-b border-white/10 bg-black/40 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'pending'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Clock className="w-4 h-4" /> Pending Approvals
                {pendingDoctors.length > 0 && (
                  <span className="px-2 py-0.5 text-xs bg-amber-500 text-black font-extrabold rounded-full">
                    {pendingDoctors.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('approved')}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'approved'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <CheckCircle2 className="w-4 h-4 text-green-400" /> Approved Doctors
                <span className="px-2 py-0.5 text-xs bg-cyan-500/30 text-cyan-300 rounded-full font-bold">
                  {approvedDoctors.length}
                </span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
                <span className="text-sm text-gray-400 font-medium">Loading doctor records...</span>
              </div>
            ) : activeTab === 'pending' ? (
              displayedPending.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3 opacity-60" />
                  <h4 className="text-lg font-bold text-white">No Pending Approvals</h4>
                  <p className="text-sm text-gray-400 mt-1">All registered doctor applications have been processed.</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/[0.02] border-b border-white/10 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Doctor Name</th>
                      <th className="px-6 py-4">Specialization</th>
                      <th className="px-6 py-4">License No</th>
                      <th className="px-6 py-4">Qualifications & Exp</th>
                      <th className="px-6 py-4">Fee (₹)</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm text-gray-200">
                    {displayedPending.map((doc) => (
                      <tr key={doc.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 font-bold text-white">
                          <div>{doc.fullName}</div>
                          <div className="text-xs text-gray-400 font-normal">{doc.user?.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                            {doc.specialization}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-amber-300 font-semibold">{doc.licenseNumber}</td>
                        <td className="px-6 py-4">
                          <div>{doc.qualifications}</div>
                          <div className="text-xs text-gray-400">{doc.experience} Yrs Experience</div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-white">₹{doc.consultationFee}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleDoctorAction(doc.id, 'approve')}
                              disabled={actionLoading === doc.id}
                              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-xs flex items-center gap-1.5 hover:scale-105 transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)] disabled:opacity-50"
                            >
                              {actionLoading === doc.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              )}
                              Approve
                            </button>
                            <button
                              onClick={() => handleDoctorAction(doc.id, 'reject')}
                              disabled={actionLoading === doc.id}
                              className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            ) : (
              displayedApproved.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <Stethoscope className="w-12 h-12 text-gray-500 mx-auto mb-3 opacity-60" />
                  <h4 className="text-lg font-bold text-white">No Approved Doctors Found</h4>
                  <p className="text-sm text-gray-400 mt-1">Approve pending applications to list doctors here.</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/[0.02] border-b border-white/10 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Doctor Name</th>
                      <th className="px-6 py-4">Specialization</th>
                      <th className="px-6 py-4">License No</th>
                      <th className="px-6 py-4">Fee (₹)</th>
                      <th className="px-6 py-4">Rating</th>
                      <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm text-gray-200">
                    {displayedApproved.map((doc) => (
                      <tr key={doc.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 font-bold text-white">
                          <div>{doc.fullName}</div>
                          <div className="text-xs text-gray-400 font-normal">{doc.user?.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                            {doc.specialization}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-gray-300">{doc.licenseNumber}</td>
                        <td className="px-6 py-4 font-semibold text-white">₹{doc.consultationFee}</td>
                        <td className="px-6 py-4">
                          <span className="text-amber-400 font-bold">★ {doc.rating || 5.0}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-300 border border-green-500/30">
                            <CheckCircle2 className="w-3 h-3" /> Approved
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}
          </div>
        </GlassPanel>
      </div>
    </DashboardLayout>
  );
}
