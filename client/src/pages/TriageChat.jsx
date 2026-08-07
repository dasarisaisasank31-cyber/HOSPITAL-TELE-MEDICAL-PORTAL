import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api/api';
import { Bot, Send, AlertCircle, CheckCircle2, Stethoscope, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TriageChat = () => {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleTriage = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    
    setLoading(true);
    try {
      const res = await api.post('/triage', { symptoms });
      setResult(res.data);
    } catch (err) {
      alert('Triage analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '3rem', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>AI Triage Companion</h1>
          <p style={{ color: 'var(--text-dim)' }}>Describe your symptoms for instant AI guidance</p>
        </header>

        <div style={{ flex: 1, maxWidth: '800px', width: '100%', margin: '0 auto' }}>
          {!result ? (
            <div className="glass-card" style={{ padding: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ padding: '0.75rem', background: 'rgba(34,211,238,0.1)', borderRadius: '1rem' }}>
                  <Bot color="var(--cyan-primary)" size={24} />
                </div>
                <div>
                  <h3 style={{ margin: 0 }}>How can I help you today?</h3>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-dim)' }}>Please describe your symptoms in detail.</p>
                </div>
              </div>

              <form onSubmit={handleTriage}>
                <textarea
                  className="input-field"
                  placeholder="e.g., I have a sharp pain in my lower abdomen and a mild fever since last night..."
                  style={{ minHeight: '150px', resize: 'vertical', marginBottom: '1.5rem', paddingTop: '1rem' }}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  required
                ></textarea>
                <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Analyze Symptoms</>}
                </button>
              </form>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', animation: 'fadeIn 0.5s ease' }}>
              {result.goToERImmediately && (
                <div style={{ padding: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '1rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <AlertCircle size={24} />
                  <div style={{ fontWeight: 'bold' }}>URGENT: Please proceed to the nearest Emergency Room immediately.</div>
                </div>
              )}

              <div className="glass-card" style={{ padding: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                  <div>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 'bold', 
                      textTransform: 'uppercase', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '1rem',
                      background: result.urgencyLevel === 'high' ? 'rgba(239,68,68,0.1)' : result.urgencyLevel === 'medium' ? 'rgba(234,179,8,0.1)' : 'rgba(34,197,94,0.1)',
                      color: result.urgencyLevel === 'high' ? '#ef4444' : result.urgencyLevel === 'medium' ? '#eab308' : '#22c55e'
                    }}>
                      {result.urgencyLevel} Urgency
                    </span>
                    <h2 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Triage Result</h2>
                    <p style={{ color: 'var(--text-dim)' }}>Based on your description, here is what we found:</p>
                  </div>
                  <button onClick={() => setResult(null)} style={{ background: 'none', border: 'none', color: 'var(--cyan-primary)', cursor: 'pointer', fontWeight: 'bold' }}>Start Over</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div>
                    <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={18} color="var(--cyan-primary)" /> Possible Conditions</h4>
                    <ul style={{ padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {result.possibleConditions.map((c, i) => (
                        <li key={i} style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', fontSize: '0.875rem' }}>{c}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Stethoscope size={18} color="var(--cyan-primary)" /> Recommended Action</h4>
                    <div style={{ padding: '1.25rem', background: 'rgba(34,211,238,0.05)', border: '1px solid rgba(34,211,238,0.1)', borderRadius: '1rem' }}>
                      <p style={{ fontWeight: 'bold', color: 'var(--cyan-primary)', margin: '0 0 0.5rem 0' }}>See a {result.recommendedSpecialist}</p>
                      <p style={{ fontSize: '0.875rem', margin: 0, lineHeight: 1.5 }}>{result.advice}</p>
                    </div>
                    <button 
                      onClick={() => navigate('/dashboard/patient/appointments', { state: { specialist: result.recommendedSpecialist }})}
                      className="btn-primary" 
                      style={{ marginTop: '1.5rem', width: '100%' }}
                    >
                      Book Appointment Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TriageChat;
