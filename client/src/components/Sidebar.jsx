import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Activity, LogOut, Calendar, FileText, Bot } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const patientMenu = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard/patient' },
    { name: 'AI Triage', icon: <Bot size={20} />, path: '/dashboard/patient/triage' },
    { name: 'Appointments', icon: <Calendar size={20} />, path: '/dashboard/patient/appointments' },
    { name: 'Prescriptions', icon: <FileText size={20} />, path: '/dashboard/patient/prescriptions' },
  ];

  const doctorMenu = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard/doctor' },
    { name: 'Patient Queue', icon: <Users size={20} />, path: '/dashboard/doctor/queue' },
  ];

  const menu = user?.role === 'DOCTOR' ? doctorMenu : patientMenu;

  return (
    <aside style={{ width: '280px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', borderRight: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
        <div style={{ width: '40px', height: '40px', background: 'linear-gradient(to br, var(--cyan-primary), var(--blue-primary))', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Activity color="white" size={24} />
        </div>
        <span style={{ fontSize: '1.25rem', fontWeights: 'bold', letterSpacing: '-0.025em' }}>MediConnect</span>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {menu.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.875rem 1.25rem',
              borderRadius: '1rem',
              border: 'none',
              background: location.pathname === item.path ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
              color: location.pathname === item.path ? 'var(--cyan-primary)' : 'var(--text-dim)',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s'
            }}
          >
            {item.icon}
            {item.name}
          </button>
        ))}
      </nav>

      <button
        onClick={() => { logout(); navigate('/login'); }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '0.875rem 1.25rem',
          borderRadius: '1rem',
          border: 'none',
          background: 'transparent',
          color: '#f87171',
          cursor: 'pointer',
          fontWeight: '600',
          marginTop: 'auto'
        }}
      >
        <LogOut size={20} />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
