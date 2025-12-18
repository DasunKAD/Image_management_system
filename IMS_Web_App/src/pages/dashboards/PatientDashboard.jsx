import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import apiService from '../../services/api';
import { Heart, Activity, Calendar, FileText } from 'lucide-react';

const PatientDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    apiService.patients.getCurrentPatient().then(res => setData(res.data));
  }, []);

  return (
    <Layout>
      <div className="fade-in">
        <h1>Welcome, {data?.fullName}</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
          <div className="card">
            <h3>Upcoming Appointments</h3>
            {data?.tasks?.filter(t => t.status !== 'COMPLETED').map((t, i) => (
              <div key={i} style={{ padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
                <Calendar size={16} /> {new Date(t.createdOn).toLocaleDateString()} - {t.description}
              </div>
            ))}
          </div>
          <div className="card">
            <h3>Recent Reports</h3>
            <button className="btn btn-secondary" style={{ width: '100%' }}>View Full Medical History</button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PatientDashboard;