import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'PATIENT',
    specialization: '',
    licenseNumber: ''
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      if (formData.role === 'DOCTOR') navigate('/dashboard/doctor');
      else navigate('/dashboard/patient');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="glass-card" style={{ maxWidth: '450px', width: '100%', padding: '2rem' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Create Account</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-dim)', marginBottom: '1.5rem' }}>Join MediConnect Healthcare</p>
        
        {error && <div style={{ color: '#f87171', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.25rem', borderRadius: '0.75rem' }}>
          <button 
            type="button" 
            style={{ flex: 1, padding: '0.5rem', borderRadius: '0.5rem', border: 'none', background: formData.role === 'PATIENT' ? 'rgba(255,255,255,0.1)' : 'transparent', color: 'white', cursor: 'pointer' }}
            onClick={() => setFormData({...formData, role: 'PATIENT'})}
          >Patient</button>
          <button 
            type="button" 
            style={{ flex: 1, padding: '0.5rem', borderRadius: '0.5rem', border: 'none', background: formData.role === 'DOCTOR' ? 'rgba(255,255,255,0.1)' : 'transparent', color: 'white', cursor: 'pointer' }}
            onClick={() => setFormData({...formData, role: 'DOCTOR'})}
          >Doctor</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Full Name" 
            className="input-field" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            required 
          />
          <input 
            type="email" 
            placeholder="Email Address" 
            className="input-field" 
            value={formData.email} 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="input-field" 
            value={formData.password} 
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
            required 
          />
          
          {formData.role === 'DOCTOR' && (
            <>
              <input 
                type="text" 
                placeholder="Specialization" 
                className="input-field" 
                value={formData.specialization} 
                onChange={(e) => setFormData({...formData, specialization: e.target.value})} 
                required 
              />
              <input 
                type="text" 
                placeholder="License Number" 
                className="input-field" 
                value={formData.licenseNumber} 
                onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})} 
                required 
              />
            </>
          )}

          <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Register</button>
        </form>
        
        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-dim)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--cyan-primary)', fontWeight: 'bold', textDecoration: 'none' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
