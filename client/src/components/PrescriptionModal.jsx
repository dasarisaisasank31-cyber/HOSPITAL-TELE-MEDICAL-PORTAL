import React, { useState } from 'react';
import { X, Plus, Trash2, Download, FilePlus, Loader2 } from 'lucide-react';
import api from '../api/api';

const PrescriptionModal = ({ appointment, onClose }) => {
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', duration: '', instructions: '' }]);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const addMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '', duration: '', instructions: '' }]);
  };

  const removeMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const newMedicines = [...medicines];
    newMedicines[index][field] = value;
    setMedicines(newMedicines);
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/prescriptions/${appointment._id}/generate-pdf`, { medicines });
      setPdfUrl(res.data.downloadUrl);
    } catch (err) {
      alert('Failed to generate prescription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', padding: '1rem' }}>
      <div className="glass-card" style={{ maxWidth: '700px', width: '100%', padding: '2.5rem', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ margin: 0 }}>Write Prescription</h2>
            <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-dim)', fontSize: '0.875rem' }}>Patient: {appointment.patientId.name}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}><X /></button>
        </div>

        {!pdfUrl ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {medicines.map((m, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr auto', gap: '0.75rem', alignItems: 'center', padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <input placeholder="Medicine" className="input-field" value={m.name} onChange={(e) => handleChange(i, 'name', e.target.value)} />
                  <input placeholder="Dosage" className="input-field" value={m.dosage} onChange={(e) => handleChange(i, 'dosage', e.target.value)} />
                  <input placeholder="Duration" className="input-field" value={m.duration} onChange={(e) => handleChange(i, 'duration', e.target.value)} />
                  <input placeholder="Instructions" className="input-field" value={m.instructions} onChange={(e) => handleChange(i, 'instructions', e.target.value)} />
                  {medicines.length > 1 && (
                    <button onClick={() => removeMedicine(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={addMedicine} style={{ background: 'none', border: 'none', color: 'var(--cyan-primary)', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={18} /> Add Medicine
              </button>
              <button 
                onClick={handleGenerate} 
                disabled={loading || medicines[0].name === ''} 
                className="btn-primary" 
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <><FilePlus size={18} /> Generate Signed PDF</>}
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ padding: '2rem', background: 'rgba(34,197,94,0.1)', borderRadius: '50%', width: 'fit-content', margin: '0 auto 2rem auto' }}>
              <CheckCircle2 color="#22c55e" size={64} />
            </div>
            <h3>Prescription Generated!</h3>
            <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>The prescription has been digitally signed and stored securely.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <a 
                href={`http://localhost:5000${pdfUrl}`} 
                target="_blank" 
                rel="noreferrer" 
                className="btn-primary" 
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}
              >
                <Download size={18} /> Download Now
              </a>
              <button onClick={onClose} style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '0.75rem', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionModal;
