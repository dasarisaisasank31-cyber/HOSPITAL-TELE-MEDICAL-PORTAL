"use client";
import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Activity, LogOut, Calendar, FileText, Bot, Clock, DollarSign, Settings, Menu, X } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const role = session?.user?.role || 'PATIENT';
  
  const menuConfig = {
    PATIENT: [
      { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard/patient' },
      { name: 'AI Symptom Checker', icon: <Bot size={20} />, path: '/dashboard/patient/symptom-check' },
      { name: 'Find Doctors', icon: <Users size={20} />, path: '/doctors' },
      { name: 'Appointments', icon: <Calendar size={20} />, path: '/dashboard/patient/appointments' },
      { name: 'Prescriptions', icon: <FileText size={20} />, path: '/dashboard/patient/prescriptions' },
    ],
    DOCTOR: [
      { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard/doctor' },
      { name: 'Patient Queue', icon: <Users size={20} />, path: '/dashboard/doctor/queue' },
      { name: 'Availability', icon: <Clock size={20} />, path: '/dashboard/doctor/availability' },
      { name: 'Earnings', icon: <DollarSign size={20} />, path: '/dashboard/doctor/earnings' },
    ],
    ADMIN: [
      { name: 'Overview', icon: <LayoutDashboard size={20} />, path: '/dashboard/admin' },
      { name: 'Manage Users', icon: <Users size={20} />, path: '/dashboard/admin/users' },
      { name: 'Verify Doctors', icon: <Activity size={20} />, path: '/dashboard/admin/doctors' },
    ],
    PHARMACIST: [
      { name: 'Incoming Orders', icon: <FileText size={20} />, path: '/dashboard/pharmacist' },
    ]
  };

  const currentMenu = menuConfig[role as keyof typeof menuConfig] || [];
  const activeMenuName = currentMenu.find(m => m.path === pathname)?.name || 'Dashboard';

  return (
    <div className="min-h-screen bg-[#030712] text-white flex overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-blue-900/20 via-transparent to-transparent pointer-events-none"></div>

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-black/50 backdrop-blur-3xl border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between gap-3 mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                <Activity className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-cyan-300 tracking-tight">
                MediConnect
              </span>
            </div>
            <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>
          
          <div className="mb-6 px-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{role} PORTAL</p>
          </div>

          <nav className="space-y-2">
            {currentMenu.map((item) => {
              const isActive = pathname === item.path;
              return (
                <a
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-cyan-500/10 to-blue-600/10 text-cyan-400 border border-cyan-500/20 shadow-[inset_0_0_20px_rgba(34,211,238,0.05)]' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <span className={isActive ? 'drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : ''}>{item.icon}</span>
                  {item.name}
                </a>
              );
            })}
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-white/5 space-y-2">
          <button 
            className="flex items-center gap-3 px-4 py-3.5 w-full text-left rounded-2xl text-sm font-semibold text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-300"
          >
            <Settings size={20} />
            Settings
          </button>
          <button 
            onClick={() => signOut()}
            className="flex items-center gap-3 px-4 py-3.5 w-full text-left rounded-2xl text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 border border-transparent hover:border-red-500/20"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileMenuOpen(false)}></div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen relative z-10">
        <header className="h-20 bg-black/20 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 lg:px-10 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {activeMenuName}
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-white">{session?.user?.name || 'User'}</p>
              <p className="text-xs text-gray-400">{session?.user?.email}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <span className="text-cyan-400 font-bold text-lg">
                {session?.user?.name?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>
        </header>
        
        <div className="flex-1 p-6 lg:p-10 overflow-y-auto custom-scrollbar relative">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
