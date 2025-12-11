import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PatientManagement from './pages/PatientManagement';
import StaffManagement from './pages/StaffManagement';
import AppointmentScheduling from './pages/AppointmentScheduling';
import ImageUpload from './pages/ImageUpload';
import DiagnosisReports from './pages/DiagnosisReports';
import BillingInvoice from './pages/BillingInvoice';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients"
              element={
                <ProtectedRoute roles={['ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_DOCTOR']}>
                  <PatientManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff"
              element={
                <ProtectedRoute roles={['ROLE_ADMIN', 'ROLE_STAFF']}>
                  <StaffManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <ProtectedRoute roles={['ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_DOCTOR']}>
                  <AppointmentScheduling />
                </ProtectedRoute>
              }
            />
            <Route
              path="/images"
              element={
                <ProtectedRoute roles={['ROLE_RADIOLOGIST', 'ROLE_DOCTOR']}>
                  <ImageUpload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/diagnosis"
              element={
                <ProtectedRoute roles={['ROLE_DOCTOR']}>
                  <DiagnosisReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/billing"
              element={
                <ProtectedRoute roles={['ROLE_FINANCE', 'ROLE_ADMIN']}>
                  <BillingInvoice />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
