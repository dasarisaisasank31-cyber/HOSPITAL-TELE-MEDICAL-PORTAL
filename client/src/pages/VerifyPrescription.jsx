import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';
import { CheckCircle, XCircle, FileText, User, UserCheck, Calendar, Activity, Loader2 } from 'lucide-react';

const VerifyPrescription = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await api.get(`/prescriptions/${id}/verify`);
        setResult(res.data);
      } catch (err) {
        setResult({ valid: false, error: 'Prescription not found or corrupted' });
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#030712' }}>
        <Loader2 className="animate-spin" color="var(--cyan-primary)" size={48} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#030712', padding: '2rem' }}>
      <div className="glass-card" style={{ maxWidth: '600px', width: '100%', padding: '3rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '2rem', background: result?.valid ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', marginBottom: '2rem' }}>
          {result?.valid ? <CheckCircle size={48} color="#22c55e" /> : <XCircle size={48} color="#ef4444" />}
        </div>
        
        <h1 style={{ marginBottom: '0.5rem' }}>{result?.valid ? 'Authentic Prescription' : 'Verification Failed'}</h1>
        <p style={{ color: 'var(--text-dim)', marginBottom: '2.5rem' }}>{result?.valid ? 'This digital prescription has been verified as authentic and signed by a licensed physician.' : 'The QR code or ID provided does not match any authentic records in our system.'}</p>

        {result?.valid && result.details && (
          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 'bold' }}>Patient Name</label>
                <p style={{ margin: '0.25rem 0 0 0', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={16} /> {result.details.patient}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 'bold' }}>Prescribing Doctor</label>
                <p style={{ margin: '0.25rem 0 0 0', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><UserCheck size={16} /> Dr. {result.details.doctor}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 'bold' }}>Issued Date</label>
                <p style={{ margin: '0.25rem 0 0 0', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={16} /> {new Date(result.details.date).toLocaleDateString()}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 'bold' }}>System Status</label>
                <p style={{ margin: '0.25rem 0 0 0', fontWeight: 'bold', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={16} /> Verified</p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginBottom: '1rem' }}>Medications Authorized</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {result.details.medicines.map((m, i) => (
                  <div key={i} style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem', fontSize: '0.875rem' }}>
                    <strong>{m.name}</strong> - {m.dosage} ({m.duration})
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: '3rem' }}>
          <Link to="/" style={{ color: 'var(--cyan-primary)', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
             Return to MediConnect Portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyPrescription;
