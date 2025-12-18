import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  UserCog, 
  Calendar, 
  Image, 
  FileText, 
  DollarSign, 
  LogOut, 
  Menu, 
  X,
  Activity,
  ClipboardList,
  ListChecks
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { 
      path: '/dashboard', 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      roles: [] 
    },
    { 
      path: '/worklist', 
      icon: ClipboardList, 
      label: 'Worklist (Pending)', 
      roles: ['ROLE_TECHNICIAN', 'ROLE_ADMIN'] 
    },
    { 
      path: '/radiologist-tasks', 
      icon: ListChecks, 
      label: 'Pending Tasks List', 
      roles: ['ROLE_RADIOLOGIST', 'ROLE_ADMIN'] 
    },
    { 
      path: '/patients', 
      icon: Users, 
      label: 'Patients', 
      roles: ['ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_DOCTOR']
    },
    { 
      path: '/staff', 
      icon: UserCog, 
      label: 'Staff Management', 
      roles: ['ROLE_ADMIN', 'ROLE_STAFF']
    },
    { 
      path: '/appointments', 
      icon: Calendar, 
      label: 'Appointments', 
      roles: ['ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_DOCTOR']
    },
    // { 
    //   path: '/images', 
    //   icon: Image, 
    //   label: 'Medical Images', 
    //   roles: ['ROLE_RADIOLOGIST', 'ROLE_DOCTOR']
    // },
    { 
      path: '/worklist', // Assuming you use the worklist created in the previous step
      icon: ClipboardList, 
      label: 'Radiology Worklist', 
      roles: ['ROLE_TECHNICIAN', 'ROLE_RADIOLOGIST', 'ROLE_ADMIN'] 
    },
    { 
      path: '/diagnosis', 
      icon: FileText, 
      label: 'Diagnosis', 
      roles: ['ROLE_DOCTOR'] 
    },
    // { 
    //   path: '/billing', 
    //   icon: DollarSign, 
    //   label: 'Billing', 
    //   roles: ['ROLE_FINANCE', 'ROLE_ADMIN'] 
    // },
    { 
      path: '/finance', 
      icon: DollarSign, 
      label: 'Invoices', 
      roles: ['ROLE_FINANCE', 'ROLE_ADMIN'] 
    },
    { 
      path: '/my-portal', 
      icon: Users, // Or any icon like Heart, User, etc.
      label: 'My Health Portal', 
      roles: ['ROLE_PATIENT'] 
    },
  ];

  const visibleMenuItems = menuItems.filter(item => 
    item.roles.length === 0 || hasRole(item.roles)
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? '260px' : '0',
          background: 'var(--surface)',
          borderRight: '1px solid var(--border)',
          transition: 'width 0.3s ease',
          overflow: 'hidden',
          position: 'fixed',
          height: '100vh',
          zIndex: 1000,
        }}
      >
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Activity size={28} color="var(--primary-green)" />
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                HealthCare
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Management System
              </p>
            </div>
          </div>
        </div>

        <nav style={{ padding: '1rem' }}>
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  marginBottom: '0.25rem',
                  borderRadius: 'var(--radius)',
                  background: isActive ? 'var(--secondary-green)' : 'transparent',
                  color: isActive ? 'var(--primary-green-dark)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 400,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--surface-alt)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <Icon size={20} />
                <span style={{ fontSize: '0.875rem' }}>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div style={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          right: 0,
          padding: '1rem',
          borderTop: '1px solid var(--border)',
          background: 'var(--surface)'
        }}>
          <div style={{ 
            padding: '0.75rem',
            background: 'var(--surface-alt)',
            borderRadius: 'var(--radius)',
            marginBottom: '0.75rem'
          }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              {user?.name}
            </p>
            <p style={{ 
              fontSize: '0.75rem', 
              color: 'var(--text-secondary)',
              textTransform: 'capitalize'
            }}>
              {user?.role}
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              background: 'var(--error)',
              color: 'white',
              borderRadius: 'var(--radius)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '0.875rem',
            }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        marginLeft: sidebarOpen ? '260px' : '0',
        transition: 'margin-left 0.3s ease',
      }}>
        {/* Header */}
        <header style={{
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'var(--surface-alt)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
          }}>
            <div style={{ textAlign: 'right', display: 'none', '@media (minWidth: 640px)': { display: 'block' } }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.name}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                {user?.role}
              </p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ padding: '2rem 1.5rem' }}>
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
          }}
        />
      )}
    </div>
  );
};

export default Layout;
