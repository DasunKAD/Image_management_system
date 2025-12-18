import React from 'react';
import Layout from '../../components/Layout';
import { UserPlus, CalendarCheck, Search, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StaffDashboard = () => {
  const navigate = useNavigate();

  const actions = [
    { label: 'Register Patient', icon: UserPlus, path: '/patients' },
    { label: 'Book Appointment', icon: CalendarCheck, path: '/appointments' },
    { label: 'Search Records', icon: Search, path: '/patients' }
  ];

  return (
    <Layout>
      <div className="fade-in">
        <h1>Reception Overview</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '2rem' }}>
          {actions.map((act, i) => (
            <button key={i} className="card" onClick={() => navigate(act.path)} 
                    style={{ textAlign: 'center', padding: '2rem', border: '1px solid var(--border)' }}>
              <act.icon size={40} color="var(--primary-green)" style={{ marginBottom: '1rem' }} />
              <div style={{ fontWeight: 600 }}>{act.label}</div>
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default StaffDashboard;