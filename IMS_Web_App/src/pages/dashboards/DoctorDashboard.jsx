import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import apiService from '../../services/api';
import { Calendar, Clipboard, User, Clock } from 'lucide-react';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.appointments.getAll().then(res => {
      setAppointments(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <Layout>
      <div className="fade-in">
        <h1>Clinical Dashboard</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '2rem' }}>
          <div className="card">
            <h3>Today's Schedule</h3>
            <div style={{ marginTop: '1rem' }}>
              {appointments.map(appt => (
                <div key={appt.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{appt.patientName}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{appt.type}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14}/> {appt.time}</div>
                    <span className="badge badge-warning">{appt.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ background: 'var(--secondary-green)' }}>
            <h3>Quick Actions</h3>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>New Diagnosis</button>
            <button className="btn btn-secondary" style={{ width: '100%', marginTop: '0.5rem' }}>View Patients</button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorDashboard;