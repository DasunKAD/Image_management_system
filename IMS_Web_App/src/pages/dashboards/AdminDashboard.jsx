
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import apiService from '../../services/api';
import { Users, UserCog, Activity, ShieldCheck, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiService.dashboard.getStats();
        setStats(res.data);
      } finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  if (loading) return <Layout><div className="spinner" style={{margin: '4rem auto'}} /></Layout>;

  const cards = [
    { label: 'Total Patients', value: stats?.totalPatients, icon: Users, color: 'var(--info)' },
    { label: 'Active Staff', value: stats?.totalStaff, icon: UserCog, color: 'var(--primary-green)' },
    { label: 'Revenue', value: `$${stats?.totalRevenue}`, icon: TrendingUp, color: 'var(--success)' },
    { label: 'System Status', value: 'Healthy', icon: ShieldCheck, color: 'var(--primary-green)' }
  ];

  return (
    <Layout>
      <div className="fade-in">
        <h1>Admin Command Center</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>System-wide performance and management</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          {cards.map((card, i) => (
            <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ padding: '1rem', background: 'var(--surface-alt)', borderRadius: 'var(--radius)' }}>
                <card.icon size={32} color={card.color} />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{card.label}</p>
                <h2 style={{ margin: 0 }}>{card.value}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;