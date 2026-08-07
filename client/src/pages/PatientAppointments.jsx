import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import api from '../api/api';
import { Search, Calendar, User, ArrowRight, Loader2, Filter } from 'lucide-react';

const PatientAppointments = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(location.state?.specialist || '');
  const [bookingData, setBookingData] = useState({ doctorId: '', scheduledAt: '', notes: '' });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get('/auth/doctors');
        setDoctors(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBook = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    try {
      await api.post('/appointments', bookingData);
      alert('Appointment booked successfully!');
      navigate('/dashboard/patient');
    } catch (err) {
      alert('Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '3rem', overflowY: 'auto' }}>
        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Book an Appointment</h1>
          <p style={{ color: 'var(--text-dim)' }}>Find the right specialist for your needs</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '3rem' }}>
          <div>
            <div className="glass-card" style={{ padding: '1rem 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Search color="var(--text-dim)" size={20} />
              <input 
                type="text" 
                placeholder="Search by doctor name or specialization..." 
                className="input-field" 
                style={{ border: 'none', background: 'transparent', padding: 0 }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Loader2 className="animate-spin" color="var(--cyan-primary)" size={32} /></div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {filteredDoctors.map(doc => (
                  <div key={doc._id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <div style={{ width: '64px', height: '64px', borderRadius: '1.25rem', background: 'linear-gradient(to br, var(--cyan-primary), var(--blue-primary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User color="white" size={32} />
                      </div>
                      <div>
                        <h3 style={{ margin: 0 }}>Dr. {doc.name}</h3>
                        <p style={{ margin: '0.25rem 0 0.5rem 0', color: 'var(--cyan-primary)', fontWeight: 'bold', fontSize: '0.875rem' }}>{doc.specialization}</p>
                        <p style={{ margin: 0, color: 'var(--text-dim)', fontSize: '0.75rem' }}>License: {doc.licenseNumber}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setBookingData({ ...bookingData, doctorId: doc._id })}
                      className="btn-primary" 
                      style={{ padding: '0.5rem 1.25rem', background: bookingData.doctorId === doc._id ? 'var(--cyan-primary)' : 'rgba(255,255,255,0.05)', color: bookingData.doctorId === doc._id ? 'white' : 'var(--text-dim)' }}
                    >
                      {bookingData.doctorId === doc._id ? 'Selected' : 'Select'}
                    </button>
                  </div>
                ))}
                {filteredDoctors.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-dim)' }}>No doctors found matching your search.</p>}
              </div>
            )}
          </div>

          <aside>
            <div className="glass-card" style={{ padding: '2rem', position: 'sticky', top: 0 }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Booking Details</h3>
              <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-dim)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Selected Doctor</label>
                  <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.875rem' }}>
                    {bookingData.doctorId ? `Dr. ${doctors.find(d => d._id === bookingData.doctorId)?.name}` : 'No doctor selected'}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-dim)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Appointment Date & Time</label>
                  <input 
                    type="datetime-local" 
                    className="input-field" 
                    required 
                    value={bookingData.scheduledAt}
                    onChange={(e) => setBookingData({ ...bookingData, scheduledAt: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-dim)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Reason for Visit</label>
                  <textarea 
                    className="input-field" 
                    placeholder="Briefly describe your symptoms or reason for the visit..." 
                    style={{ minHeight: '100px' }}
                    value={bookingData.notes}
                    onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={bookingLoading || !bookingData.doctorId || !bookingData.scheduledAt} 
                  className="btn-primary" 
                  style={{ marginTop: '1rem' }}
                >
                  {bookingLoading ? <Loader2 className="animate-spin" size={20} /> : 'Confirm Booking'}
                </button>
              </form>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default PatientAppointments;
