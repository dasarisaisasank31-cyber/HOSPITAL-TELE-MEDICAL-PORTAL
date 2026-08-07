import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api/api';
import { Video, FileText, ArrowRight, Activity, Clock, Download } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appts, scripts] = await Promise.all([
          api.get('/appointments'),
          api.get('/prescriptions/patient') // I need to implement this backend route
        ]);
        setAppointments(appts.data);
        setPrescriptions(scripts.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '3rem', overflowY: 'auto' }}>
        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Patient Dashboard</h1>
          <p style={{ color: 'var(--text-dim)' }}>Welcome back to your healthcare portal</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {/* AI Triage Card */}
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <Activity color="var(--cyan-primary)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ marginBottom: '0.5rem' }}>AI Triage Companion</h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>Describe your symptoms and get instant AI-powered medical guidance.</p>
            </div>
            <button 
              onClick={() => navigate('/dashboard/patient/triage')}
              className="btn-primary" 
              style={{ marginTop: '1.5rem', width: 'fit-content', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              Start Triage <ArrowRight size={16} />
            </button>
          </div>

          {/* Appointments Section */}
          <div className="glass-card" style={{ gridColumn: 'span 2', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3>Upcoming Appointments</h3>
              <button style={{ color: 'var(--cyan-primary)', background: 'none', border: 'none', fontWeight: '600', cursor: 'pointer' }}>View All</button>
            </div>
            
            {appointments.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '2rem' }}>No upcoming appointments.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {appointments.map(appt => (
                  <div key={appt._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(34,211,238,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Clock color="var(--cyan-primary)" size={20} />
                      </div>
                      <div>
                        <p style={{ fontWeight: 'bold' }}>{appt.doctorId.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{new Date(appt.scheduledAt).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    {appt.roomId ? (
                      <button 
                        onClick={() => navigate(`/video/${appt.roomId}`)}
                        className="btn-primary" 
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                      >
                        <Video size={16} /> Join Call
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-dim)', padding: '0.25rem 0.75rem', background: 'rgba(255,255,255,0.1)', borderRadius: '2rem' }}>{appt.status}</span>
                    )}
                  </div>
                  {appt.labResults && appt.labResults.length > 0 && (
                    <div style={{ marginTop: '0.5rem', paddingLeft: '4.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      {appt.labResults.map((url, i) => (
                        <a 
                          key={i} 
                          href={`http://localhost:5000${url}`} 
                          target="_blank" 
                          rel="noreferrer"
                          style={{ fontSize: '0.75rem', color: 'var(--cyan-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}
                        >
                          <FileText size={12} /> Lab Result {i+1}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

          {/* Prescriptions Section */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Your Prescriptions</h3>
            {prescriptions.length === 0 ? (
              <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>No prescriptions found.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {prescriptions.map(p => (
                  <div key={p._id} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <p style={{ fontWeight: 'bold', margin: 0 }}>Dr. {p.doctorId.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: 0 }}>{new Date(p.generatedAt).toLocaleDateString()}</p>
                    </div>
                    <a 
                      href={`http://localhost:5000${p.pdfUrl}`} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ color: 'var(--cyan-primary)', fontSize: '0.875rem', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      <Download size={14} /> Download PDF
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>

  );
};

export default PatientDashboard;
