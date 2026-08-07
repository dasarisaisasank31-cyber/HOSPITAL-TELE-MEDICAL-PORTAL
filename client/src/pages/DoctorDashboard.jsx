import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api/api';
import { Video, FileText, CheckCircle, XCircle, Upload, FileUp } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import PrescriptionModal from '../components/PrescriptionModal';


const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const appts = await api.get('/appointments');
        setAppointments(appts.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const startCall = async (id) => {
    try {
      const res = await api.patch(`/appointments/${id}/start-call`);
      navigate(`/video/${res.data.roomId}`);
    } catch (err) {
      alert('Failed to start call');
    }
  };

  const handleFileUpload = async (id, files) => {
    const formData = new FormData();
    for (let file of files) {
      formData.append('files', file);
    }
    try {
      await api.post(`/appointments/${id}/lab-results`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Lab results uploaded successfully');
    } catch (err) {
      alert('Upload failed');
    }
  };


  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '3rem', overflowY: 'auto' }}>
        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Doctor Portal</h1>
          <p style={{ color: 'var(--text-dim)' }}>Manage your patient queue and consultations</p>
        </header>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Upcoming Consultations</h3>
          
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '1rem', color: 'var(--text-dim)' }}>Patient</th>
                <th style={{ padding: '1rem', color: 'var(--text-dim)' }}>Time</th>
                <th style={{ padding: '1rem', color: 'var(--text-dim)' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-dim)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(appt => (
                <tr key={appt._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>{appt.patientId.name}</td>
                  <td style={{ padding: '1rem' }}>{new Date(appt.scheduledAt).toLocaleString()}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: appt.status === 'CONFIRMED' ? 'var(--cyan-primary)' : 'var(--text-dim)', padding: '0.25rem 0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '2rem' }}>
                      {appt.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => startCall(appt._id)}
                        className="btn-primary" 
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                      >
                        <Video size={16} /> Start Call
                      </button>
                      <button 
                        onClick={() => setSelectedAppt(appt)}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: 'none', borderRadius: '0.75rem', cursor: 'pointer' }}
                      >
                        <FileText size={16} /> Prescription
                      </button>
                      <label style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: 'none', borderRadius: '0.75rem', cursor: 'pointer' }}>
                        <Upload size={16} />
                        <input 
                          type="file" 
                          multiple 
                          hidden 
                          onChange={(e) => handleFileUpload(appt._id, e.target.files)} 
                        />
                      </label>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {appointments.length === 0 && <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>No pending appointments</div>}
        </div>

        {selectedAppt && (
          <PrescriptionModal 
            appointment={selectedAppt} 
            onClose={() => setSelectedAppt(null)} 
          />
        )}
      </main>
    </div>

  );
};

export default DoctorDashboard;
