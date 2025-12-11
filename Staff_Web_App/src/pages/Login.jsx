import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const demoAccounts = [
    { email: 'admin@hospital.com', password: 'admin123', role: 'Admin' },
    { email: 'doctor@hospital.com', password: 'doctor123', role: 'Doctor' },
    { email: 'radiologist@hospital.com', password: 'radio123', role: 'Radiologist' },
    { email: 'finance@hospital.com', password: 'finance123', role: 'Finance' },
    // { email: 'management@hospital.com', password: 'manage123', role: 'Management' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(credentials);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (email, password) => {
    setCredentials({ email, password });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        filter: 'blur(60px)',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '-5%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        filter: 'blur(60px)',
      }} />

      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1100px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem',
        }}>
          {/* Login Form */}
          <div className="card" style={{
            padding: '3rem',
            animation: 'fadeIn 0.5s ease-out',
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--secondary-green)',
                marginBottom: '1rem',
              }}>
                <Activity size={32} color="var(--primary-green)" />
              </div>
              <h1 style={{ marginBottom: '0.5rem' }}>Welcome Back</h1>
              <p style={{ color: 'var(--text-secondary)' }}>
                Sign in to Healthcare Management System
              </p>
            </div>

            {error && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem',
                background: '#fee2e2',
                border: '1px solid #fecaca',
                borderRadius: 'var(--radius)',
                marginBottom: '1.5rem',
                color: '#991b1b',
              }}>
                <AlertCircle size={20} />
                <span style={{ fontSize: '0.875rem' }}>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail 
                    size={18} 
                    style={{ 
                      position: 'absolute', 
                      left: '1rem', 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                    }} 
                  />
                  <input
                    type="email"
                    className="input"
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    placeholder="Enter your email"
                    required
                    style={{ paddingLeft: '3rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock 
                    size={18} 
                    style={{ 
                      position: 'absolute', 
                      left: '1rem', 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                    }} 
                  />
                  <input
                    type="password"
                    className="input"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    placeholder="Enter your password"
                    required
                    style={{ paddingLeft: '3rem' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ 
                  width: '100%',
                  padding: '0.875rem',
                  fontSize: '1rem',
                }}
              >
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="spinner" />
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>

          {/* Demo Credentials */}
          <div className="card" style={{
            padding: '3rem',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            animation: 'fadeIn 0.5s ease-out 0.2s backwards',
          }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Demo Accounts</h2>
            <p style={{ 
              color: 'var(--text-secondary)', 
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
            }}>
              Click on any account below to auto-fill the login form
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {demoAccounts.map((account, index) => (
                <button
                  key={index}
                  onClick={() => handleDemoLogin(account.email, account.password)}
                  style={{
                    padding: '1rem',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary-green)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem',
                  }}>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      {account.role}
                    </span>
                    <span className="badge badge-success">
                      Active
                    </span>
                  </div>
                  <p style={{ 
                    fontSize: '0.75rem', 
                    color: 'var(--text-secondary)',
                    marginBottom: '0.25rem',
                  }}>
                    {account.email}
                  </p>
                  <p style={{ 
                    fontSize: '0.75rem', 
                    color: 'var(--text-muted)',
                    fontFamily: 'monospace',
                  }}>
                    Password: {account.password}
                  </p>
                </button>
              ))}
            </div>

            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: 'var(--secondary-green)',
              borderRadius: 'var(--radius)',
            }}>
              <p style={{ 
                fontSize: '0.75rem', 
                color: 'var(--primary-green-dark)',
                lineHeight: 1.5,
              }}>
                <strong>Note:</strong> This is a demo application. All login data is predefined here for easy access.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
