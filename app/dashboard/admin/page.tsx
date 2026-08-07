"use client";
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/widgets/StatCard';
import { GlassPanel } from '@/components/widgets/GlassPanel';
import { Users, Video, IndianRupee, Stethoscope, Activity, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const kpis = [
    { title: "Total Users", value: "1,248", change: "+12%", icon: Users, trendDirection: "up" as const, delay: 100 },
    { title: "Consultations Today", value: "42", change: "+5", icon: Video, trendDirection: "up" as const, delay: 200 },
    { title: "Revenue MTD", value: "₹2,84,000", change: "+18%", icon: IndianRupee, trendDirection: "up" as const, delay: 300 },
    { title: "Active Doctors", value: "86", change: "+3", icon: Stethoscope, trendDirection: "up" as const, delay: 400 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        <div className="flex justify-between items-end animate-slide-up">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Platform Analytics</h1>
            <p className="text-gray-500 mt-2">Real-time overview of MediConnect's performance.</p>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, idx) => (
            <StatCard key={kpi.title} {...kpi} trend={kpi.change} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Consultations Table */}
          <GlassPanel delay={500} className="lg:col-span-2 !p-0 overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white/50">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900 text-lg">Platform Activity</h3>
              </div>
              <select className="text-xs font-bold border-none bg-white dark:bg-gray-800 rounded-xl px-3 py-2 outline-none shadow-sm cursor-pointer">
                <option>Last 24 Hours</option>
                <option>Last 7 Days</option>
                <option>This Month</option>
              </select>
            </div>
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-gray-800/20">
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b dark:border-gray-800">Patient</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b dark:border-gray-800">Doctor</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b dark:border-gray-800">Specialty</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b dark:border-gray-800">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                  {[
                    { p: "Rahul V.", d: "Dr. Priya S.", t: "Cardiology", s: "Completed" },
                    { p: "Anil K.", d: "Dr. Rajesh K.", t: "General", s: "In Progress" },
                    { p: "Sita D.", d: "Dr. Anitha R.", t: "Skin Care", s: "Scheduled" },
                    { p: "Jyothi L.", d: "Dr. Suresh P.", t: "Orthopedic", s: "Completed" },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-8 py-5 text-sm font-bold text-gray-900 dark:text-gray-100">{row.p}</td>
                      <td className="px-8 py-5 text-sm text-gray-600 dark:text-gray-400">{row.d}</td>
                      <td className="px-8 py-5">
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full">{row.t}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          row.s === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                          row.s === 'In Progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 
                          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {row.s}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassPanel>

          {/* Specialization Demand */}
          <GlassPanel delay={600} className="flex flex-col">
            <div className="flex items-center gap-2 mb-8">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-gray-900 text-lg">Demand by Specialty</h3>
            </div>
            <div className="space-y-6 flex-1">
              {[
                { name: "Cardiology", value: 85, color: "bg-gradient-to-r from-red-500 to-red-400" },
                { name: "General Medicine", value: 72, color: "bg-gradient-to-r from-blue-500 to-blue-400" },
                { name: "Dermatology", value: 64, color: "bg-gradient-to-r from-purple-500 to-purple-400" },
                { name: "Orthopedic", value: 48, color: "bg-gradient-to-r from-orange-500 to-orange-400" },
              ].map((spec, idx) => (
                <div key={spec.name} className="animate-slide-up" style={{ animationDelay: `${700 + idx * 100}ms` }}>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-gray-700 dark:text-gray-300">{spec.name}</span>
                    <span className="text-gray-900 dark:text-white">{spec.value}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
                    <div className={`h-full ${spec.color} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${spec.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      </div>
    </DashboardLayout>
  );
}
