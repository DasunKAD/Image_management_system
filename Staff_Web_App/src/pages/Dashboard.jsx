import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import apiService from '../services/api';
import { Users, UserCog, Calendar, DollarSign, TrendingUp, Activity } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await apiService.dashboard.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats ? [
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: Users,
      color: '#059669',
      bgColor: '#d1fae5',
    },
    {
      title: 'Total Staff',
      value: stats.totalStaff,
      icon: UserCog,
      color: '#3b82f6',
      bgColor: '#dbeafe',
    },
    {
      title: 'Appointments',
      value: stats.totalAppointments,
      icon: Calendar,
      color: '#f59e0b',
      bgColor: '#fef3c7',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: '#10b981',
      bgColor: '#d1fae5',
    },
  ] : [];

  if (loading) {
    return (
      <Layout>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '400px',
        }}>
          <div className="spinner" style={{ width: 40, height: 40, borderWidth: 4 }} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="fade-in">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            marginBottom: '0.5rem',
          }}>
            <Activity size={32} color="var(--primary-green)" />
            <h1>Dashboard</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            Overview of your healthcare management system
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}>
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="card"
                style={{
                  animation: `fadeIn 0.5s ease-out ${index * 0.1}s backwards`,
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1rem',
                }}>
                  <div>
                    <p style={{ 
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)',
                      marginBottom: '0.5rem',
                    }}>
                      {stat.title}
                    </p>
                    <h2 style={{ 
                      fontSize: '2rem',
                      fontWeight: 700,
                      color: stat.color,
                    }}>
                      {stat.value}
                    </h2>
                  </div>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: 'var(--radius)',
                    background: stat.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Icon size={28} color={stat.color} />
                  </div>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--success)',
                  fontSize: '0.875rem',
                }}>
                  <TrendingUp size={16} />
                  <span>Active</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}>
          {/* Appointments Overview */}
          <div className="card" style={{ animation: 'fadeIn 0.5s ease-out 0.4s backwards' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Appointments Overview</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Scheduled
                </span>
                <span style={{ 
                  fontWeight: 600,
                  fontSize: '1.25rem',
                  color: 'var(--warning)',
                }}>
                  {stats.pendingAppointments}
                </span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Completed
                </span>
                <span style={{ 
                  fontWeight: 600,
                  fontSize: '1.25rem',
                  color: 'var(--success)',
                }}>
                  {stats.completedAppointments}
                </span>
              </div>
              <div style={{ 
                height: '8px',
                background: 'var(--surface-alt)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden',
                marginTop: '0.5rem',
              }}>
                <div style={{
                  height: '100%',
                  width: `${(stats.completedAppointments / stats.totalAppointments) * 100}%`,
                  background: 'var(--primary-green)',
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.5s ease',
                }} />
              </div>
            </div>
          </div>

          {/* Billing Overview */}
          <div className="card" style={{ animation: 'fadeIn 0.5s ease-out 0.5s backwards' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Billing Overview</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Total Revenue
                </span>
                <span style={{ 
                  fontWeight: 600,
                  fontSize: '1.25rem',
                  color: 'var(--success)',
                }}>
                  ${stats.totalRevenue.toLocaleString()}
                </span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Pending Payments
                </span>
                <span style={{ 
                  fontWeight: 600,
                  fontSize: '1.25rem',
                  color: 'var(--warning)',
                }}>
                  {stats.pendingPayments}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div 
          className="card" 
          style={{ 
            marginTop: '1.5rem',
            background: 'var(--secondary-green)',
            border: '1px solid var(--accent-green)',
            animation: 'fadeIn 0.5s ease-out 0.6s backwards',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'var(--primary-green)',
              animation: 'pulse 2s ease-in-out infinite',
            }} />
            <p style={{ fontWeight: 500, color: 'var(--primary-green-dark)' }}>
              System running on demo mode with mock data
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </Layout>
  );
};

export default Dashboard;
