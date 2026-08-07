import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import PatientAppointments from './pages/PatientAppointments';
import DoctorDashboard from './pages/DoctorDashboard';

import VideoRoom from './pages/VideoRoom';
import TriageChat from './pages/TriageChat';
import VerifyPrescription from './pages/VerifyPrescription';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify/:id" element={<VerifyPrescription />} />
      
      <Route path="/dashboard/patient" element={
        <ProtectedRoute roles={['PATIENT']}>
          <PatientDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard/doctor" element={
        <ProtectedRoute roles={['DOCTOR']}>
          <DoctorDashboard />
        </ProtectedRoute>
      } />

      <Route path="/dashboard/patient/appointments" element={
        <ProtectedRoute roles={['PATIENT']}>
          <PatientAppointments />
        </ProtectedRoute>
      } />

      <Route path="/dashboard/patient/triage" element={

        <ProtectedRoute roles={['PATIENT']}>
          <TriageChat />
        </ProtectedRoute>
      } />

      <Route path="/video/:roomId" element={
        <ProtectedRoute>
          <VideoRoom />
        </ProtectedRoute>
      } />

      <Route path="/" element={
        user ? (
          user.role === 'DOCTOR' ? <Navigate to="/dashboard/doctor" /> : <Navigate to="/dashboard/patient" />
        ) : <Navigate to="/login" />
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
